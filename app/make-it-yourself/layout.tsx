import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Design Atelier — Make It Yourself | Asuka Couture',
    description: 'Design your own custom luxury menswear with Asuka’s AI Atelier. Create bespoke sherwanis, suits, and kurtas with AI-assisted design.',
    keywords: ['custom menswear', 'AI fashion design', 'bespoke sherwani', 'make it yourself', 'asuka atelier'],
}

export default function MIYLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
