import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'
import { checkRateLimit } from '@/lib/rate-limit'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SESSION_CHAINS: Record<string, Promise<void>> = {}
const SESSION_LAST_TS: Record<string, number> = {}
const MIN_SESSION_GAP_MS = 700
const RESPONSE_SLA_MS = 12000
const MAX_FULL_AI_INFLIGHT = 2
let FULL_AI_INFLIGHT = 0
const FAIR_QUEUE: string[] = []

type ChatEntry = { role: 'user' | 'assistant'; content: string }
type Mention = { title?: string; handle?: string; reason?: string }
const CHAT_HISTORY: Record<string, ChatEntry[]> = {}

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

async function completeStylistJSON(messages: Array<{ role: string; content: string }>, isFirstTurn: boolean) {
  const model = isFirstTurn ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile'
  const maxTokens = isFirstTurn ? 420 : 760

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await groq.chat.completions.create({
        messages: messages as never,
        model,
        temperature: 0.55,
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

type CityProfile = {
  city: string
  keywords: string[]
  styleHints: string[]
  followUps: string[]
}

const CITY_PROFILES: CityProfile[] = [
  {
    city: 'Jaipur',
    keywords: ['jaipur', 'c-scheme', 'malviya nagar', 'raja park', 'vaishali nagar'],
    styleHints: ['pastel', 'ivory', 'bandhgala', 'sherwani', 'embroidered', 'regal', 'raw silk'],
    followUps: [
      'Would you like a regal pastel Jaipur wedding look?',
      'Do you want a bandhgala-first Jaipur recommendation?',
      'Should I suggest breathable day-ceremony options for Jaipur weather?'
    ]
  },
  {
    city: 'Delhi',
    keywords: ['delhi', 'new delhi', 'south delhi', 'gurgaon', 'noida'],
    styleHints: ['tuxedo', 'indo-western', 'structured', 'sharp', 'dark', 'black', 'cocktail'],
    followUps: [
      'Should I keep this more Delhi cocktail and reception focused?',
      'Would you prefer a sharp tuxedo-first shortlist?',
      'Do you want statement Indo-Western options for Delhi events?'
    ]
  },
  {
    city: 'Mumbai',
    keywords: ['mumbai', 'bandra', 'juhu', 'andheri', 'powai'],
    styleHints: ['lightweight', 'linen', 'comfort', 'humidity-friendly', 'resort', 'minimal'],
    followUps: [
      'Want lightweight options suited to Mumbai humidity?',
      'Should I prioritize breathable evening looks?',
      'Do you want a modern minimal Mumbai wedding-guest style?'
    ]
  },
  {
    city: 'Bengaluru',
    keywords: ['bengaluru', 'bangalore', 'indiranagar', 'koramangala', 'whitefield'],
    styleHints: ['smart', 'minimal', 'tailored', 'subtle', 'clean'],
    followUps: [
      'Want a clean, smart Bengaluru-style shortlist?',
      'Should I keep it subtle and contemporary?',
      'Do you prefer minimal tailoring with one statement piece?'
    ]
  },
  {
    city: 'Hyderabad',
    keywords: ['hyderabad', 'hitech city', 'gachibowli', 'jubilee hills', 'banjara hills'],
    styleHints: ['sherwani', 'zardozi', 'rich', 'regal', 'ivory', 'gold', 'wedding'],
    followUps: [
      'Want a Hyderabad-inspired regal sherwani shortlist?',
      'Should I show richer festive embroidery options?',
      'Do you prefer traditional royal or modern royal styling?'
    ]
  },
  {
    city: 'Chennai',
    keywords: ['chennai', 'adyar', 'nungambakkam', 'anna nagar', 'omr'],
    styleHints: ['lightweight', 'silk', 'cream', 'ivory', 'humidity-friendly', 'minimal'],
    followUps: [
      'Want Chennai climate-friendly elegant options?',
      'Should I prioritize breathable festive fabrics?',
      'Do you want traditional silk influence or modern minimal?'
    ]
  },
  {
    city: 'Kolkata',
    keywords: ['kolkata', 'calcutta', 'salt lake', 'ballygunge', 'park street'],
    styleHints: ['classic', 'cultural', 'silk', 'kurta', 'textured', 'vintage'],
    followUps: [
      'Want classic Kolkata cultural elegance options?',
      'Should I include rich silk festive recommendations?',
      'Do you prefer heritage-inspired or modern festive looks?'
    ]
  },
  {
    city: 'Pune',
    keywords: ['pune', 'koregaon park', 'baner', 'hinjawadi', 'aundh'],
    styleHints: ['smart casual', 'lightweight', 'linen', 'minimal', 'clean'],
    followUps: [
      'Want lightweight Pune-friendly options?',
      'Should I keep this smart casual with festive touch?',
      'Do you want a breathable day-to-evening shortlist?'
    ]
  }
]

function detectCityProfile(text: string): CityProfile | null {
  const lowered = text.toLowerCase()
  for (const profile of CITY_PROFILES) {
    if (profile.keywords.some((k) => lowered.includes(k))) {
      return profile
    }
  }
  return null
}

interface StylistRequestBody {
  message?: string
  session_id?: string
}

export async function POST(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  let sid = `anon_${req.headers.get('x-forwarded-for') || 'default'}`

  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429, headers: { ...headers, 'X-RateLimit-Reset': rateLimit.reset } }
      )
    }

    const { message, session_id } = (await req.json()) as StylistRequestBody
    const normalizedMessage = (message || '').trim()
    if (!normalizedMessage) return NextResponse.json({ error: 'Message is required' }, { status: 400, headers })

    sid = session_id || sid

    if (!CHAT_HISTORY[sid]) {
      CHAT_HISTORY[sid] = []
    }

    const allProducts = getAllProducts()
    const historyText = CHAT_HISTORY[sid].map((entry) => entry.content).join(' ').toLowerCase()
    const cityProfile = detectCityProfile(`${historyText} ${normalizedMessage}`)

    const currentMsgLower = normalizedMessage.toLowerCase()
    const shortlist = allProducts.map((p) => {
      let score = 0
      const text = `${p.title} ${p.handle} ${p.description}`.toLowerCase()

      if (currentMsgLower.includes('wedding')) score += text.includes('sherwani') || text.includes('wedding') ? 50 : 0
      if (currentMsgLower.includes('tuxedo')) score += text.includes('tuxedo') ? 100 : 0
      if (currentMsgLower.includes('haldi')) score += text.includes('yellow') || text.includes('kurta') ? 50 : 0

      if (cityProfile) {
        cityProfile.styleHints.forEach((hint) => {
          if (text.includes(hint)) score += 14
        })
      }

      return { ...p, score }
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 90)

    const catalogString = shortlist.map((p) => `${p.title}|${p.handle}|${p.price}`).join('\n')

    const systemPrompt = `You are Ayaan, Master Stylist at Asuka Couture (est. 1991).
Be polished, concise, and practical.

Goals:
- Recommend 3-5 best products only.
- Explain why each product fits the event and vibe.
- Ask one useful next-step question.
- Keep category integrity (ethnic for sherwani/kurta, western for tuxedo/suit).

Return JSON only:
{
  "reply": "2-3 sentence style advice",
  "products_mentioned": [{"title":"...","handle":"...","reason":"..."}],
  "follow_up_prompts": ["...", "...", "..."]
}

City context:
${cityProfile ? `Detected: ${cityProfile.city}. Style cues: ${cityProfile.styleHints.join(', ')}.` : 'No city context detected yet.'}

Catalog shortlist (Title|Handle|Price):
${catalogString}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...CHAT_HISTORY[sid],
      { role: 'user', content: normalizedMessage }
    ]

    if (!canRunFullTurn(sid)) {
      return NextResponse.json({
        reply: 'Our styling studio is serving other queued clients first. You are in line and your next attempt gets priority.',
        products_mentioned: [],
        follow_up_prompts: [
          'Share day or night preference while we queue your request.',
          'Tell me classic or statement styling so I can prepare faster.',
          'Add your city/area for better localized recommendations.'
        ],
        city_context: cityProfile?.city || null,
        degraded: true,
        queued: true,
        queue_position: queuePosition(sid),
      }, { headers })
    }

    const isFirstTurn = CHAT_HISTORY[sid].length < 2
    let completion
    try {
      completion = await withTimeout(withSessionThrottle(sid, async () => {
        return completeStylistJSON(messages, isFirstTurn)
      }), RESPONSE_SLA_MS, 'stylist_completion')
    } finally {
      releaseFullTurn()
    }

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse: {
      reply?: string
      products_mentioned?: Mention[]
      follow_up_prompts?: string[]
    }
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = {
        reply: 'I apologize, Sir. My sartorial thoughts got slightly tangled. Could you rephrase your request?',
        products_mentioned: [],
        follow_up_prompts: []
      }
    }

    const fallbackFollowUps = cityProfile?.followUps || [
      'Is this for a day event or a night event?',
      'Would you prefer a classic or bold silhouette?',
      'Share your city or area for more localized recommendations.'
    ]

    const followUps = Array.isArray(parsedResponse.follow_up_prompts) && parsedResponse.follow_up_prompts.length > 0
      ? parsedResponse.follow_up_prompts.slice(0, 3)
      : fallbackFollowUps.slice(0, 3)

    CHAT_HISTORY[sid].push({ role: 'user', content: normalizedMessage })
    CHAT_HISTORY[sid].push({ role: 'assistant', content: parsedResponse.reply || '' })
    if (CHAT_HISTORY[sid].length > 12) CHAT_HISTORY[sid] = CHAT_HISTORY[sid].slice(-12)

    const finalProducts = ((parsedResponse.products_mentioned || []) as Mention[]).map((p) => {
      const fullProd = allProducts.find((f) => f.handle === p.handle || f.title === p.title)
      if (fullProd) {
        return { ...fullProd, recommendation_reason: p.reason }
      }
      return null
    }).filter(Boolean)

    let complementary: unknown[] = []
    if (finalProducts.length > 0) {
      try {
        const { getCompleteLook } = await import('@/lib/styling-graph')
        const topProduct = finalProducts[0] as { handle?: string }
        if (topProduct?.handle) {
          complementary = await getCompleteLook(topProduct.handle)
        }
      } catch {
        complementary = []
      }
    }

    return NextResponse.json({
      reply: parsedResponse.reply,
      products_mentioned: finalProducts,
      complementary,
      follow_up_prompts: followUps,
      city_context: cityProfile?.city || null,
      degraded: false,
      queued: false,
    }, { headers })

  } catch (error) {
    console.error('Stylist API Error:', error)
    if (isRateLimitError(error) || error instanceof TimeoutError) {
      enqueueSession(sid)
      return NextResponse.json({
        reply: error instanceof TimeoutError
          ? 'Our styling studio is taking longer than expected. I can still help instantly: share event timing and city, and I will prioritize a concise shortlist next.'
          : 'Our styling studio is briefly crowded. I can still help: share your event type and I will return a concise shortlist in a moment.',
        products_mentioned: [],
        follow_up_prompts: [
          'Is this for day or night?',
          'Do you prefer classic or statement styling?',
          'Share your city for local recommendations.'
        ],
        city_context: null,
        degraded: true,
        queued: true,
        queue_position: queuePosition(sid),
      }, { headers })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers })
  }
}