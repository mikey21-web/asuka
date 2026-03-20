import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Size Finder — Asuka Couture',
    description: 'Find your perfect fit with Asuka Couture’s AI Sizer. Map your size from Zara, H&M, Raymond, and more to our heritage tailoring.',
    keywords: ['AI sizer', 'size finder', 'bespoke sizing', 'asuka couture sizing', 'menswear fit'],
}

export default function SizingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
