import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ethnic Wear for Men | Sherwanis, Kurtas, Bandhgala | Asuka Couture',
    description: 'Explore Asuka Couture\'s luxury ethnic menswear collection. Handcrafted sherwanis, kurta sets, bandhgala suits & indo-western ensembles. Since 1991.',
    openGraph: {
        title: 'Ethnic Menswear Collection | Asuka Couture',
        description: 'Luxury handcrafted ethnic wear for men. 35 years of heritage.',
    },
}

export default function EthnicHomeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
