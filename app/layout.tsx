import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Mono, Outfit, Josefin_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-josefin',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Asuka Couture — Rituals of Fine Dressing',
  description: 'Luxury Indian menswear with 35 years of heritage. Bespoke sherwanis, kurtas, suits and indo-western. Hyderabad · Mumbai · Ahmedabad.',
  keywords: ['luxury menswear', 'indian menswear', 'sherwani', 'kurta', 'bespoke', 'asuka couture'],
  openGraph: {
    title: 'Asuka Couture — Rituals of Fine Dressing',
    description: 'Luxury Indian menswear. 35 years of heritage.',
    images: ['https://asukacouture.com/cdn/shop/files/2_550d2346-b3c7-4096-822c-b4cb7995459a.png'],
  },
}

import WhatsAppFloat from '@/components/WhatsAppFloat'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} ${josefin.variable}`}>
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
