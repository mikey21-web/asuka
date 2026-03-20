import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface AnalyticsEventBody {
  event?: string
  page?: string
  ts?: string
  [key: string]: unknown
}

// Lightweight event sink for UX experiments (non-persistent for now).
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyticsEventBody

    if (!body.event || typeof body.event !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing event' }, { status: 400 })
    }

    console.log('[analytics:event]', {
      event: body.event,
      page: body.page || 'unknown',
      ts: body.ts || new Date().toISOString(),
      payload: body,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[analytics:event] failed', error)
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
  }
}
