import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Find Our Stores | Asuka Couture Boutiques',
    description: 'Visit Asuka Couture boutiques in Hyderabad, Mumbai & Ahmedabad. Get directions, store hours, and contact details for personalized luxury menswear shopping.',
}

export default function StoreLocatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
