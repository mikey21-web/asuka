'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard' // Added this import
import { HERO_ETHNIC, HERO_WESTERN, STORES, BRAND_SLIDER_IMAGES, formatPrice } from '@/lib/site-data'
import { getCelebrityProducts, type CatalogProduct } from '@/lib/catalog'
import DigitalStylistSection from '@/components/sections/DigitalStylist'

/* ── Preload celebrity products at module level ── */
export default function Home() {
  const celebrities = getCelebrityProducts()
  const [heroTab, setHeroTab] = useState<'ethnic' | 'western'>('ethnic')

  return (
    <>
      <Header />
      <main style={{ background: 'white', minHeight: '100vh' }}>

        {/* ═══ 1. SPLIT HERO (Exactly matching live site) ═══ */}
        <section className="relative h-screen w-full flex flex-col md:flex-row pt-[90px] md:pt-[100px] overflow-hidden bg-black gap-0">
          {/* LEFT: ETHNIC WEAR */}
          <Link href="/ethnic-home" className="relative flex-1 group overflow-hidden block w-full h-full">
            <Image
              src={HERO_ETHNIC}
              alt="Ethnic Wear"
              fill
              className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              priority
            />
            {/* Gradient for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 md:via-transparent md:to-transparent pointer-events-none" />

            <div className="absolute bottom-[30px] md:bottom-[50px] w-full text-center">
              <h2 className="font-serif text-white text-[28px] sm:text-[34px] md:text-[44px] font-normal tracking-[2px] m-0 drop-shadow-md">
                ETHNIC WEAR
              </h2>
            </div>
          </Link>

          {/* RIGHT: WESTERN WEAR */}
          <Link href="/western-home" className="relative flex-1 group overflow-hidden block w-full h-full border-t border-white/20 md:border-t-0 md:border-l md:border-white/20">
            <Image
              src={HERO_WESTERN}
              alt="Western Wear"
              fill
              className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 md:via-transparent md:to-transparent pointer-events-none" />

            <div className="absolute bottom-[30px] md:bottom-[50px] w-full text-center">
              <h2 className="font-serif text-white text-[28px] sm:text-[34px] md:text-[44px] font-normal tracking-[2px] m-0 drop-shadow-md">
                WESTERN WEAR
              </h2>
            </div>
          </Link>
        </section>

        {/* ═══ 2. SPOTTED IN ASUKA — Celebrity grid ═══ */}
        <section className="py-[60px] md:py-[80px]">
          <div className="page-width max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="text-center mb-10">
              <h2 className="font-serif text-[28px] md:text-[36px] font-normal text-[#1a1410] tracking-[2px] uppercase m-0">Spotted in asuka</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map(c => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/collections/celebrity-styles" className="inline-block px-10 py-3.5 border border-[#1a1410] font-sans text-[13px] tracking-[2px] uppercase text-[#1a1410] no-underline transition-colors hover:bg-[#1a1410] hover:text-white">
                View all
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 3. BRAND SLIDER (Swiper-like auto scroll) ═══ */}
        <section className="py-[60px] md:py-[80px] bg-[#FAF6F1] overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[28px] md:text-[36px] font-normal text-[#1a1410] tracking-[2px] uppercase m-0">The Brand in Press</h2>
          </div>
          <div className="relative w-full overflow-hidden flex">
            <div className="flex shrink-0 animate-marquee gap-4 px-4 whitespace-nowrap min-w-max">
              {[...BRAND_SLIDER_IMAGES, ...BRAND_SLIDER_IMAGES].map((src, i) => (
                <div key={i} className="relative w-[280px] h-[380px] shrink-0 border border-[#e8e0d6] shadow-sm">
                  <img src={src} alt="brand press" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee { animation: marquee 30s linear infinite; }
            .animate-marquee:hover { animation-play-state: paused; }
          `}</style>
        </section>

        {/* ═══ 4. STORE LOCATOR ═══ */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>STORE LOCATOR</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {STORES.map(s => (
                <div key={s.city} className="text-center">
                  <a href={s.map} target="_blank" rel="noopener noreferrer">
                    <div className="overflow-hidden mb-4">
                      <img src={s.img} alt={s.city} className="w-full h-auto block" />
                    </div>
                  </a>
                  <h3 className="font-sans text-[21px] font-normal text-[#1a1410] lowercase mb-2">{s.city}</h3>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-1">{s.address}</p>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-4">{s.hours}</p>
                  <a href={s.map} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 border border-[#1a1410] font-sans text-[12px] font-normal tracking-[2px] lowercase text-[#1a1410] no-underline">get directions</a>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="https://asukacouture.com/pages/book-an-appointment" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', padding: '14px 40px', border: '1px solid #1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none',
              }}>BOOK AN APPOINTMENT</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
