import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://asukacouture.vercel.app' // Replace with actual domain when known

    // Core static routes
    const routes = [
        '',
        '/ethnic-home',
        '/western-home',
        '/about-us',
        '/contact',
        '/store-locator',
        '/sizing',
        '/book-an-appointment',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Collections
    const collections = [
        'luxury-men-clothing', 'bandhgala-suit-for-men', 'indowestern-for-men',
        'kurta-bundi-set-for-men', 'kurta-set-for-men', 'sherwani',
        'embroidered-shoes-for-men', 'embroidered-stoles', 'casual-suits-for-men',
        'suit-set-for-men', 'co-ord-sets-for-men', 'jackets-for-men',
        'celebrity-styles', 'ethnic-wear-for-men', 'festive-wear-for-men',
        'new-arrivals', 'best-selling-products', 'haldi', 'mehendi', 'cocktail'
    ]
    const collectionRoutes = collections.map((c) => ({
        url: `${baseUrl}/collections/${c}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Products
    const products = getAllProducts()
    const productRoutes = products.map((p) => ({
        url: `${baseUrl}/products/${p.handle}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...routes, ...collectionRoutes, ...productRoutes]
}
