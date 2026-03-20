/* ═══════════════════════════════════════════════════════════
   ASUKA COUTURE — SERVER-ONLY CATALOG UTILITIES
   ═══════════════════════════════════════════════════════════ */

import clientPromise from './mongodb'
import catalog, { type CatalogProduct } from './catalog'

/**
 * Get products from MongoDB (Live data)
 */
export async function getProductsFromDB(): Promise<CatalogProduct[]> {
    try {
        const client = await clientPromise
        const db = client.db('asuka_couture')
        const items = await db.collection('asuka_products').find({}).toArray()
        
        if (items.length > 0) {
            return (items as any[]).map(p => ({
                id: p.id,
                title: p.title,
                handle: p.handle,
                price: p.price,
                image_count: p.image_count,
                first_image: p.first_image,
                all_images: p.all_images,
                product_url: p.product_url,
                description: p.description,
                variants: p.variants
            })) as CatalogProduct[]
        }
    } catch (err) {
        console.warn('Failed to fetch from DB, falling back to static catalog:', err)
    }
    return catalog
}
