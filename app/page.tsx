'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
      <main style={{ background: 'white' }}>

        {/* ═══ 1. HERO — 95vh promo grid (Ethnic + Western) ═══ */}
        <section className="relative min-h-[95vh] grid grid-cols-1 md:grid-cols-2">
          <div className="absolute inset-x-0 bottom-[15vh] z-20 flex flex-col items-center gap-6 animate-fadeUp delay-300">
            <div className="flex flex-wrap justify-center gap-4 px-4">
              <Link href="/make-it-yourself" className="px-8 py-3 bg-white text-[#1a1410] font-mono text-[11px] tracking-[3px] uppercase hover:bg-[#a17a58] hover:text-white transition-all border border-white">
                Make It Yourself
              </Link>
              <Link href="/sizing" className="px-8 py-3 bg-transparent text-white font-mono text-[11px] tracking-[3px] uppercase hover:bg-white hover:text-[#1a1410] transition-all border border-white">
                AI Sizer Finder
              </Link>
            </div>
          </div>
          {/* SEO H1 Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
            <h1 className="font-serif text-white/90 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.15em] uppercase drop-shadow-lg animate-fadeIn">
              Asuka <span className="italic block mt-2 text-2xl sm:text-4xl md:text-5xl opacity-80 tracking-widest">Couture</span>
            </h1>
          </div>

          {/* Ethnic half */}
          <Link href="/ethnic-home" onMouseEnter={() => setHeroTab('ethnic')}
            className="relative overflow-hidden block h-[50vh] md:h-auto">
            <Image src={HERO_ETHNIC} alt="Luxury Ethnic Wear for Men" fill priority sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover absolute inset-0 transition-all duration-500 ${heroTab === 'ethnic' ? 'scale-[1.05]' : 'scale-100'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </Link>
          {/* Western half */}
          <Link href="/western-home" onMouseEnter={() => setHeroTab('western')}
            className="relative overflow-hidden block h-[50vh] md:h-auto">
            <Image src={HERO_WESTERN} alt="Premium Western Wear for Men" fill priority sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover absolute inset-0 transition-all duration-500 ${heroTab === 'western' ? 'scale-[1.05]' : 'scale-100'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </Link>

        </section>

        {/* ═══ 2. DIGITAL STYLIST SECTION ═══ */}
        <DigitalStylistSection />

        {/* ═══ 3. SPOTTED IN ASUKA — Celebrity grid ═══ */}
        <section style={{ padding: '60px 0 40px' }}>
          <div className="page-width" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Spotted in asuka</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map(c => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/collections/celebrity-styles" style={{
                display: 'inline-block', padding: '14px 40px', border: '1px solid #1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none', transition: 'all 0.3s',
              }}>
                View all
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 3. BRAND SLIDER (Swiper-like auto scroll) ═══ */}
        <section style={{ padding: '20px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '4px', animation: 'brandScroll 40s linear infinite', width: 'max-content' }}>
            {[...BRAND_SLIDER_IMAGES, ...BRAND_SLIDER_IMAGES].map((src, i) => (
              <div key={i} style={{ flex: '0 0 180px', width: '180px', height: '180px', overflow: 'hidden', borderRadius: '50%' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <style>{`@keyframes brandScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
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

/* ── Reusable Product Card (matches live site grid-product) ── */
function ProductCard({ product }: { product: CatalogProduct }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-img-wrap" style={{ position: 'relative', overflow: 'hidden', marginBottom: '12px', background: '#f5f0e8', aspectRatio: '2/3' }}>
        {product.first_image && product.first_image !== 'NO IMAGE' && (
          <Image src={product.first_image} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'top', transition: 'all 0.5s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        )}
        {/* Secondary image on hover */}
        {product.all_images[1] && (
          <Image src={product.all_images[1]} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'top', opacity: hovered ? 1 : 0, transition: 'all 0.5s ease' }} />
        )}
        {/* SHOP NOW button on hover */}
        <button type="button" style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          padding: '10px 24px', background: 'white', border: 'none',
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
          textTransform: 'uppercase', cursor: 'pointer', opacity: hovered ? 1 : 0, transition: 'all 0.5s ease',
        }}>SHOP NOW</button>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, color: '#1a1410', lineHeight: 1.5, marginBottom: '4px' }}>{product.title}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1a1410' }}>{formatPrice(product.price)}</div>
    </Link>
  )
}
