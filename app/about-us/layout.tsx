import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us | Asuka Couture — 35 Years of Fine Dressing',
    description: 'Discover the legacy of Asuka Couture. From our humble beginnings in 1991 to becoming India\'s premier luxury menswear house. Heritage, craftsmanship & innovation.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
