import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Analytics endpoint — returns empty data (no MongoDB)
export async function GET() {
  return NextResponse.json({
    generated_at: new Date().toISOString(),
    summary: {
      sizer_uses_today: 0,
      style_sessions_7d: 0,
      design_briefs_total: 0,
      design_briefs_pending: 0,
    },
    sizer: { size_distribution: [] },
    products: { by_type: [] },
    style: { top_recommended: [] },
    design: { briefs: [] },
    trends: [],
    message: 'Analytics running without database — data is session-only',
  })
}
