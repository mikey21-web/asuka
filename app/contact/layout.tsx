import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us | Asuka Couture — Luxury Indian Menswear',
    description: 'Get in touch with Asuka Couture. Visit our stores in Hyderabad, Mumbai & Ahmedabad or reach us for bespoke tailoring, styling consultations & orders.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
