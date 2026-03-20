import clientPromise from './mongodb'
import { CatalogProduct } from './catalog'

/**
 * Get stock levels for a specific product handle
 */
export async function getProductStock(handle: string) {
  try {
    const client = await clientPromise
    const db = client.db('asuka_couture')
    const product = await db.collection('asuka_products').findOne({ handle }, { projection: { variants: 1 } })
    
    return product?.variants || []
  } catch (err) {
    console.error(`Failed to fetch stock for ${handle}:`, err)
    return []
  }
}

/**
 * Check if a specific size is in stock
 */
export async function isSizeInStock(handle: string, size: string): Promise<boolean> {
  const variants = await getProductStock(handle)
  const variant = variants.find((v: any) => v.title.toLowerCase() === size.toLowerCase())
  return (variant?.inventory_quantity || 0) > 0
}

/**
 * Check if a quantity is considered "Low Stock"
 */
export function isLowStock(quantity: number): boolean {
  return quantity > 0 && quantity <= 3
}

/**
 * Filter a list of products to only those with at least one size in stock
 * Note: This is an async filter
 */
export async function filterInStockProducts(products: CatalogProduct[]): Promise<CatalogProduct[]> {
  // In a real high-traffic scenario, we'd batch this or use a more efficient query
  // For now, we assume the input products already have variant data if loaded from DB
  return products.filter(p => {
    if (!p.variants || p.variants.length === 0) return true // Fallback if no variant data
    return p.variants.some(v => v.inventory_quantity > 0)
  })
}
