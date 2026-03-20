import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/**
 * Shopify Webhook Handler
 * Listen for: products/create, products/update, products/delete
 */
export async function POST(req: NextRequest) {
  try {
    const topic = req.headers.get('x-shopify-topic')
    const shop = req.headers.get('x-shopify-shop-domain')
    const payload = await req.json()

    console.log(`Shopify Webhook Received: ${topic} for ${shop}`)

    const client = await clientPromise
    const db = client.db('asuka_couture')
    const collection = db.collection('asuka_products')

    if (topic === 'products/delete') {
      await collection.deleteOne({ id: payload.id })
    } else {
      // Create or Update
      const mappedProduct = {
        id: payload.id,
        title: payload.title,
        handle: payload.handle,
        price: payload.variants?.[0]?.price || '0',
        image_count: payload.images?.length || 0,
        first_image: payload.images?.[0]?.src || '',
        all_images: payload.images?.map((img: any) => img.src) || [],
        product_url: `https://${shop}/products/${payload.handle}`,
        description: payload.body_html || '',
        updated_at: new Date()
      }

      await collection.updateOne(
        { id: payload.id },
        { $set: mappedProduct },
        { upsert: true }
      )
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err: any) {
    console.error('Webhook processing failed:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
