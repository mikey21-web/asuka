import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sync endpoint — disabled (no MongoDB needed)
// Products are fetched directly from Shopify public API
export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Product sync disabled — products are fetched directly from Shopify API',
    synced: 0,
    failed: 0,
    total: 0,
  })
}
