import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Manual/Triggered Sync from Shopify Admin API
 */
export async function POST(req: NextRequest) {
  const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_URL?.replace('https://', '')
  const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

  if (!SHOPIFY_DOMAIN || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Shopify credentials missing' }, { status: 500 })
  }

  // 1. Apply Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
  const rateLimit = checkRateLimit(ip);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again in a minute.' },
      { status: 429, headers: { 'X-RateLimit-Reset': rateLimit.reset } }
    );
  }

  try {
    // Fetch from Shopify Admin REST API
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-04/products.json?limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`)
    }

    const { products } = await response.json()
    
    const client = await clientPromise
    const db = client.db('asuka_couture')
    const collection = db.collection('asuka_products')

    let synced = 0
    
    // Process and upsert
    for (const p of products) {
      const mapped = {
        id: p.id,
        title: p.title,
        handle: p.handle,
        price: p.variants?.[0]?.price || '0',
        image_count: p.images?.length || 0,
        first_image: p.images?.[0]?.src || '',
        all_images: p.images?.map((img: any) => img.src) || [],
        variants: p.variants?.map((v: any) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          inventory_quantity: v.inventory_quantity,
          sku: v.sku
        })) || [],
        product_url: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
        description: p.body_html || '',
        sync_date: new Date()
      }

      await collection.updateOne(
        { id: p.id },
        { $set: mapped },
        { upsert: true }
      )
      synced++
    }

    return NextResponse.json({
      status: 'ok',
      message: `Successfully synced ${synced} products from Shopify.`,
      total: synced
    })

  } catch (err: any) {
    console.error('Manual sync failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
