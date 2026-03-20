import type { Metadata, ResolvingMetadata } from 'next'
import { getProductByHandle } from '@/lib/catalog'

type Props = {
    params: { id: string }
    children: React.ReactNode
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const handle = params.id
    const product = getProductByHandle(handle)

    if (!product) {
        return {
            title: 'Product Not Found | Asuka Couture'
        }
    }

    // Fallback to parent images if we have to
    const previousImages = (await parent).openGraph?.images || []

    // Ensure description is clean
    const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
        : 'Discover bespoke Sherwanis, Indo-Western sets, Bandhgalas, Kurtas, and custom tailored Western suits from Asuka Couture.'

    return {
        title: `${product.title} | Asuka Couture`,
        description: cleanDescription,
        keywords: ['Asuka Couture', 'Menswear', product.title.split(' ').join(', ')],
        openGraph: {
            title: `${product.title} | Asuka Couture`,
            description: cleanDescription,
            url: `https://asukacouture.com/products/${handle}`,
            siteName: 'Asuka Couture',
            images: product.all_images && product.all_images.length > 0 ? product.all_images : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: cleanDescription,
            images: product.first_image ? [product.first_image] : [],
        }
    }
}

export default function ProductLayout({ children }: Props) {
    return <>{children}</>
}
