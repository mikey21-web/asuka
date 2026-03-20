/* ═══════════════════════════════════════════════════════════
   ASUKA COUTURE — PRODUCT CATALOG (Client-Safe)
   Unified catalog loader from the 3 JSON files
   742 products, 3429 images
   ═══════════════════════════════════════════════════════════ */

import catalogData from './full_catalog_audit.json'

export interface CatalogProduct {
    id: number
    title: string
    handle: string
    price: string
    image_count: number
    first_image: string
    all_images: string[]
    product_url: string
    description: string
    variants?: {
        id: number
        title: string
        price: string
        inventory_quantity: number
        sku?: string
    }[]
}

// Cast the imported JSON
const catalog = catalogData as CatalogProduct[]

/**
 * Get all 742 products
 */
export function getAllProducts(): CatalogProduct[] {
    return catalog
}

/**
 * Get a single product by handle
 */
export function getProductByHandle(handle: string): CatalogProduct | undefined {
    return catalog.find(p => p.handle === handle)
}

/**
 * Get a single product by id
 */
export function getProductById(id: number | string): CatalogProduct | undefined {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    return catalog.find(p => p.id === numId)
}

/**
 * Search products by title (case-insensitive)
 */
export function searchProducts(query: string): CatalogProduct[] {
    const lower = query.toLowerCase()
    return catalog.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.handle.toLowerCase().includes(lower)
    )
}

/**
 * Get products for a collection handle
 * Since we don't have collection->product mapping in collections.json,
 * we filter by title/handle keywords
 */
export function getCollectionProducts(collectionHandle: string): CatalogProduct[] {
    const keywords = collectionHandle.replace(/-/g, ' ').split(' ').filter(w => w.length > 2)

    // Special mappings
    const COLLECTION_KEYWORDS: Record<string, string[]> = {
        'luxury-men-clothing': [], // all products
        'bandhgala-suit-for-men': ['bandhgala'],
        'indowestern-for-men': ['indo', 'western', 'indowestern'],
        'kurta-bundi-set-for-men': ['kurta', 'bundi'],
        'kurta-set-for-men': ['kurta'],
        'sherwani': ['sherwani'],
        'embroidered-shoes-for-men': ['shoe', 'jutti', 'mojari'],
        'embroidered-stoles': ['stole', 'dupatta'],
        'casual-suits-for-men': ['casual', 'safari', 'linen suit'],
        'suit-set-for-men': ['suit', 'formal'],
        'co-ord-sets-for-men': ['co-ord', 'coord', 'co ord'],
        'jackets-for-men': ['jacket', 'blazer'],
        'celebrity-styles': ['akshay', 'tiger', 'emraan', 'dulquer', 'shiv', 'harbhajan'],
        'ethnic-wear-for-men': ['bandhgala', 'sherwani', 'kurta', 'indo', 'bundi', 'angrakha'],
        'festive-wear-for-men': ['festive', 'celebration', 'embroidered'],
        'new-arrivals': [], // return newest by id
        'best-selling-products': [], // return all, sorted by price
        'haldi': ['haldi', 'yellow', 'cream'],
        'mehendi': ['mehendi', 'green'],
        'cocktail': ['cocktail', 'party'],
    }

    const matchKeywords = COLLECTION_KEYWORDS[collectionHandle]

    // "All products" or "new arrivals" returns everything
    if (collectionHandle === 'luxury-men-clothing') return catalog
    if (collectionHandle === 'new-arrivals') return [...catalog].sort((a, b) => b.id - a.id).slice(0, 48)
    if (collectionHandle === 'best-selling-products') return [...catalog].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 48)

    if (matchKeywords && matchKeywords.length > 0) {
        return catalog.filter(p => {
            const text = (p.title + ' ' + p.handle).toLowerCase()
            return matchKeywords.some(kw => text.includes(kw))
        })
    }

    // Fallback: match by collection handle keywords
    return catalog.filter(p => {
        const text = (p.title + ' ' + p.handle).toLowerCase()
        return keywords.some(kw => text.includes(kw))
    })
}

/**
 * Get featured products for a collection
 */
export function getFeaturedProducts(collectionHandle: string, limit: number = 4): CatalogProduct[] {
    return getCollectionProducts(collectionHandle).slice(0, limit);
}

/**
 * Get celebrity products
 */
export function getCelebrityProducts(): CatalogProduct[] {
    const handles = [
        'hdhs',
        'tiger-shroff-in-charcoal-grey-woolen-suit-set',
        'emraan-hashmi-in-off-white-pinstripe-ceremonial-ensemble',
        'dulquer-salman-in-mystic-terrain-habutai-silk-shirt',
        'shiv-thakare-in-black-floraison-dori-kurta-set',
        'timeless-navy-pinstripe-suit',
    ]
    return handles.map(h => catalog.find(p => p.handle === h)).filter(Boolean) as CatalogProduct[]
}

/**
 * Get a compact string representation of all products for AI context
 */
export function getCatalogForAI(): string {
    return catalog.map(p => {
        // Strip HTML from description
        const cleanDesc = p.description.replace(/<[^>]*>?/gm, '').slice(0, 100);
        return `${p.title}|${p.handle}|${p.price}|${cleanDesc}`;
    }).join('\n');
}

export default catalog
