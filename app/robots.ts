import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://asukacouture.vercel.app' // Update when domain is final
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
