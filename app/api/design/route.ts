import { NextRequest, NextResponse } from 'next/server'
import { groqChat, DESIGN_SYSTEM_PROMPT } from '@/lib/groq'

export const dynamic = 'force-dynamic'

// In-memory session history (no MongoDB needed)
const sessionHistory = new Map<string, { role: string; content: string }[]>()

function parseDesignSummary(text: string) {
  const parsed: Record<string, string> = {}
  if (!text.includes('DESIGN SUMMARY:')) return { hasSummary: false, parsed, summary: null, imagePrompt: null, cleanReply: text }

  const sumMatch = text.match(/DESIGN SUMMARY:([\s\S]*?)(?:IMAGE PROMPT:|$)/)
  const imgMatch = text.match(/IMAGE PROMPT:([\s\S]*?)$/)

  const summary = sumMatch?.[1]?.trim() || null
  const imagePrompt = imgMatch?.[1]?.trim() || null
  const cleanReply = text.split('DESIGN SUMMARY:')[0].trim() || 'Here is your design brief. Let me know if you\'d like to refine anything.'

  if (summary) {
    summary.split('\n').forEach(line => {
      const clean = line.replace(/^-\s*/, '')
      const colonIdx = clean.indexOf(':')
      if (colonIdx > 0) {
        const k = clean.slice(0, colonIdx).trim().toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/est\.?_price/, 'estimated_price')
        const v = clean.slice(colonIdx + 1).trim()
        if (k && v) parsed[k] = v
      }
    })
  }

  return { hasSummary: true, parsed, summary, imagePrompt, cleanReply }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, session_id: rawSessionId } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const session_id = rawSessionId || `design_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    // Get or create session history (in-memory, no DB)
    if (!sessionHistory.has(session_id)) {
      sessionHistory.set(session_id, [])
    }
    const history = sessionHistory.get(session_id)!

    const messages = [
      { role: 'system' as const, content: DESIGN_SYSTEM_PROMPT },
      ...history.slice(-12).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: message },
    ]

    const fullReply = await groqChat(messages, 650, 0.8)
    const { hasSummary, parsed, summary, imagePrompt, cleanReply } = parseDesignSummary(fullReply)

    // Save to in-memory history
    history.push({ role: 'user', content: message })
    history.push({ role: 'assistant', content: fullReply })

    // Keep only last 24 messages per session
    if (history.length > 24) {
      sessionHistory.set(session_id, history.slice(-24))
    }

    return NextResponse.json({
      reply: cleanReply,
      session_id,
      has_summary: hasSummary,
      design_summary: summary,
      image_prompt: imagePrompt,
      brief_id: null,
      status: 'ok',
    })

  } catch (err: any) {
    console.error('Design API error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
