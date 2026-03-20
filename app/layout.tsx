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
  metadataBase: new URL('https://asukacouture.com'),
  title: {
    default: 'Asuka Couture | Luxury Menswear & Bespoke Rituals of Fine Dressing',
    template: '%s | Asuka Couture'
  },
  description: 'Discover Asuka Couture, India\'s premier luxury menswear brand. Explore bespoke Sherwanis, Indo-Western sets, Bandhgalas, Kurtas, and custom tailored Western suits. Visit our flagship stores in Mumbai, Hyderabad, and Ahmedabad.',
  keywords: [
    'Asuka Couture', 'luxury menswear', 'indian menswear', 'designer sherwani for men',
    'bespoke tailoring', 'kurta bundi set', 'groom wedding wear', 'tuxedo suits for men',
    'designer ethnic wear', 'mehndi outfits for men', 'sangeet wear for men', 'haldi outfits',
    'luxury fashion india'
  ],
  authors: [{ name: 'Asuka Couture' }],
  creator: 'Asuka Couture',
  publisher: 'Asuka Couture',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://asukacouture.com',
    title: 'Asuka Couture | Luxury Menswear & Bespoke Tailoring',
    description: 'Discover Asuka Couture, India\'s premier luxury menswear brand. Bespoke ethnic and western wear.',
    siteName: 'Asuka Couture',
    images: [{
      url: 'https://asukacouture.com/cdn/shop/files/2_550d2346-b3c7-4096-822c-b4cb7995459a.png',
      width: 1920,
      height: 1080,
      alt: 'Asuka Couture Luxury Menswear'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asuka Couture | Luxury Menswear',
    description: 'Bespoke tailoring, Sherwanis, and luxury menswear from Asuka Couture.',
    images: ['https://asukacouture.com/cdn/shop/files/2_550d2346-b3c7-4096-822c-b4cb7995459a.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

import WhatsAppFloat from '@/components/WhatsAppFloat'
import AIWidget from '@/components/widget/AIWidget'
import ScrollToTop from '@/components/ScrollToTop'
import { Analytics } from '@/components/VercelAnalytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} ${josefin.variable}`}>
      <body className="bg-white text-[#1a1410] antialiased selection:bg-[#a57a5a] selection:text-white">
        {children}
        <ScrollToTop />
        <WhatsAppFloat />
        <AIWidget isFloating={true} />
        <Analytics />
      </body>
    </html>
  )
}
