import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Book an Appointment | Personal Styling | Asuka Couture',
    description: 'Schedule a personal styling session at Asuka Couture. Meet our expert stylists at our Hyderabad, Mumbai, or Ahmedabad boutiques for bespoke menswear consultations.',
}

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
