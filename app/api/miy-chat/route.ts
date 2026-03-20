import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateMIYChatRequest } from '@/lib/validations'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'

const SESSION_CHAINS: Record<string, Promise<void>> = {}
const SESSION_LAST_TS: Record<string, number> = {}
const MIN_SESSION_GAP_MS = 700
const RESPONSE_SLA_MS = 12000
const MAX_FULL_AI_INFLIGHT = 2
let FULL_AI_INFLIGHT = 0
const FAIR_QUEUE: string[] = []

type MiyHistoryEntry = { role: 'user' | 'assistant'; content: string }

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    sleep(timeoutMs).then(() => {
      throw new TimeoutError(`${label} timed out after ${timeoutMs}ms`)
    })
  ])
}

function enqueueSession(sessionKey: string) {
  if (!FAIR_QUEUE.includes(sessionKey)) {
    FAIR_QUEUE.push(sessionKey)
  }
}

function queuePosition(sessionKey: string): number {
  const idx = FAIR_QUEUE.indexOf(sessionKey)
  return idx >= 0 ? idx + 1 : 0
}

function canRunFullTurn(sessionKey: string): boolean {
  const queueHead = FAIR_QUEUE[0]
  if (queueHead && queueHead !== sessionKey) {
    enqueueSession(sessionKey)
    return false
  }

  if (FULL_AI_INFLIGHT >= MAX_FULL_AI_INFLIGHT) {
    enqueueSession(sessionKey)
    return false
  }

  FULL_AI_INFLIGHT += 1
  if (FAIR_QUEUE[0] === sessionKey) {
    FAIR_QUEUE.shift()
  }
  return true
}

function releaseFullTurn() {
  FULL_AI_INFLIGHT = Math.max(0, FULL_AI_INFLIGHT - 1)
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const maybe = error as { status?: number; error?: { error?: { code?: string } } }
  return maybe.status === 429 || maybe.error?.error?.code === 'rate_limit_exceeded'
}

function getRetryDelayMs(error: unknown, attempt: number): number {
  const fallback = 700 * (attempt + 1)
  if (!error || typeof error !== 'object') return fallback
  const maybe = error as { headers?: Record<string, string> }
  const retryAfterRaw = maybe.headers?.['retry-after']
  if (!retryAfterRaw) return fallback
  const sec = Number(retryAfterRaw)
  if (!Number.isFinite(sec) || sec <= 0) return fallback
  return Math.ceil(sec * 1000)
}

async function withSessionThrottle<T>(sessionKey: string, fn: () => Promise<T>): Promise<T> {
  const prev = SESSION_CHAINS[sessionKey] || Promise.resolve()
  let release: () => void = () => { }
  const current = new Promise<void>((resolve) => {
    release = resolve
  })
  SESSION_CHAINS[sessionKey] = prev.then(() => current)

  await prev

  const waitMs = Math.max(0, (SESSION_LAST_TS[sessionKey] || 0) + MIN_SESSION_GAP_MS - Date.now())
  if (waitMs > 0) {
    await sleep(waitMs)
  }

  try {
    return await fn()
  } finally {
    SESSION_LAST_TS[sessionKey] = Date.now()
    release()
  }
}

async function completeMiyJSON(
  groq: Groq,
  messages: Array<{ role: string; content: string }>,
  isFirstTurn: boolean
) {
  const model = isFirstTurn ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile'
  const maxTokens = isFirstTurn ? 500 : 950

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await groq.chat.completions.create({
        messages: messages as never,
        model,
        temperature: 0.65,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      })
    } catch (error) {
      if (!isRateLimitError(error) || attempt === 2) {
        throw error
      }
      await sleep(getRetryDelayMs(error, attempt))
    }
  }

  throw new Error('Unable to complete request')
}

function scoreProductRelevance(query: string, title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase()
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0)
}

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  let sid = `anon_${req.headers.get('x-forwarded-for') || 'default'}`

  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          message: 'Our atelier is briefly handling high demand. I can still proceed with a quick concept draft and refine it on your next message.',
          looks: [],
          image_prompt: '',
          degraded: true,
          queued: true,
          queue_position: queuePosition(sid),
        },
        { headers: { 'X-RateLimit-Reset': rateLimit.reset } }
      )
    }

    const body = (await req.json()) as {
      inputs?: Record<string, unknown>
      message?: string
      history?: MiyHistoryEntry[]
      session_id?: string
    }

    const validation = validateMIYChatRequest({
      message: body.message,
      inputs: body.inputs,
      history: body.history,
    })
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { message, history } = validation.data!
    const inputs = body.inputs
    const userMessage = (message || '').trim()
    if (!inputs && !userMessage) return NextResponse.json({ error: 'Data is required' }, { status: 400 })

    sid = body.session_id || sid

    if (!canRunFullTurn(sid)) {
      return NextResponse.json({
        message: 'Our atelier is serving queued users first. You are in line, and your next request gets priority.',
        looks: [],
        image_prompt: '',
        degraded: true,
        queued: true,
        queue_position: queuePosition(sid),
      })
    }

    const allProducts = getAllProducts()
    const intentText = [
      message || '',
      typeof inputs?.occasion === 'string' ? inputs.occasion : '',
      typeof inputs?.colors === 'string' ? inputs.colors : '',
      typeof inputs?.fit === 'string' ? inputs.fit : '',
      typeof inputs?.budget === 'string' ? inputs.budget : ''
    ].join(' ')

    const rankedCatalog = [...allProducts]
      .map((p) => ({
        product: p,
        score: scoreProductRelevance(intentText, p.title, p.description)
      }))
      .sort((a, b) => b.score - a.score)

    const shortlistedProducts = rankedCatalog.slice(0, 24).map((entry) => entry.product)

    const simplifiedCatalog = shortlistedProducts.map((p) => ({
      title: p.title,
      image_url: p.first_image,
      desc: p.description.replace(/<[^>]*>?/gm, '').slice(0, 60)
    }))

    const systemPrompt = `You are the Head of Bespoke Design at Asuka Couture.
Tone: warm, confident, and concise.

Return JSON only with:
- message: clear design guidance in 2-4 lines
- looks: 2-3 items, each with {name, direction, fabric_notes, addons}
- image_prompt: one detailed but compact prompt

Rules:
- Use user inputs to propose practical couture directions.
- Mention WhatsApp (+91 9063356542) for final custom consultation.
- Never claim stores outside Mumbai, Hyderabad, Ahmedabad. Delhi is virtual support and shipping.

Catalog references:
${JSON.stringify(simplifiedCatalog)}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...((history || []).slice(-10)),
      { role: 'user', content: userMessage }
    ]

    const isFirstTurn = (history || []).length === 0
    let completion
    try {
      completion = await withTimeout(withSessionThrottle(sid, async () => {
        return completeMiyJSON(groq, messages, isFirstTurn)
      }), RESPONSE_SLA_MS, 'miy_completion')
    } finally {
      releaseFullTurn()
    }

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = { message: 'I apologize, my atelier had a brief interruption. Could you repeat your preferences?', looks: [] }
    }

    return NextResponse.json({ ...parsedResponse, degraded: false, queued: false })
  } catch (error) {
    console.error('MIY API Error:', error)
    if (isRateLimitError(error) || error instanceof TimeoutError) {
      enqueueSession(sid)
      return NextResponse.json({
        message: error instanceof TimeoutError
          ? 'Our atelier is taking longer than expected, so I prepared a quick path: share occasion + mood and I will return a compact concept immediately.'
          : 'Our atelier is briefly handling high demand. I can still proceed with a quick concept draft and refine it on your next message.',
        looks: [],
        image_prompt: '',
        degraded: true,
        queued: true,
        queue_position: queuePosition(sid),
      })
    }
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}