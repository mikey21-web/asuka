import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Western Wear for Men | Tuxedos, Suits, Shirts | Asuka Couture',
    description: 'Shop Asuka Couture\'s luxury western menswear. Tuxedo sets, formal suits, premium shirts, jackets & co-ord sets. Modern sophistication since 1991.',
    openGraph: {
        title: 'Western Menswear Collection | Asuka Couture',
        description: 'Modern luxury western wear for the discerning gentleman.',
    },
}

export default function WesternHomeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
