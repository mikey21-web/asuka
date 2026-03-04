'use client'
import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIStylist from '@/components/AIStylist'
import { HERO_ETHNIC, HERO_WESTERN, STORES, BRAND_SLIDER_IMAGES, formatPrice } from '@/lib/site-data'
import { getCelebrityProducts, type CatalogProduct } from '@/lib/catalog'

/* ── Preload celebrity products at module level ── */
const celebrities = getCelebrityProducts()

export default function Home() {
  const [heroTab, setHeroTab] = useState<'ethnic' | 'western'>('ethnic')

  return (
    <>
      <Header />
      <main style={{ background: 'white' }}>

        {/* ═══ 1. HERO — 95vh promo grid (Ethnic + Western) ═══ */}
        <section style={{ position: 'relative', height: '95vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Ethnic half */}
          <Link href="/pages/ethnic-home" onMouseEnter={() => setHeroTab('ethnic')}
            style={{ position: 'relative', overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
            <img src={HERO_ETHNIC} alt="Ethnic Wear"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transition: 'all 0.5s ease', transform: heroTab === 'ethnic' ? 'scale(1.02)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
          </Link>
          {/* Western half */}
          <Link href="/pages/western-home" onMouseEnter={() => setHeroTab('western')}
            style={{ position: 'relative', overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
            <img src={HERO_WESTERN} alt="Western Wear"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transition: 'all 0.5s ease', transform: heroTab === 'western' ? 'scale(1.02)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
          </Link>
        </section>

        {/* ═══ 2. SPOTTED IN ASUKA — Celebrity grid ═══ */}
        <section style={{ padding: '60px 0 40px' }}>
          <div className="page-width" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Spotted in asuka</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginBottom: '40px' }}>
              {STORES.map(s => (
                <div key={s.city} style={{ textAlign: 'center' }}>
                  <a href={s.map} target="_blank" rel="noopener noreferrer">
                    <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
                      <img src={s.img} alt={s.city} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </a>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '21px', fontWeight: 400, color: '#1a1410', textTransform: 'lowercase', marginBottom: '8px' }}>{s.city}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 400, color: '#1a1410', lineHeight: 1.6, marginBottom: '4px' }}>{s.address}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 400, color: '#1a1410', lineHeight: 1.6, marginBottom: '16px' }}>{s.hours}</p>
                  <a href={s.map} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block', padding: '10px 24px', border: '1px solid #1a1410',
                    fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, letterSpacing: '2px',
                    textTransform: 'lowercase', color: '#1a1410', textDecoration: 'none',
                  }}>get directions</a>
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
      <AIStylist />
    </>
  )
}

/* ── Reusable Product Card (matches live site grid-product) ── */
function ProductCard({ product }: { product: CatalogProduct }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-img-wrap" style={{ position: 'relative', overflow: 'hidden', marginBottom: '12px', background: '#f5f0e8' }}>
        <div style={{ paddingBottom: '125%', position: 'relative' }}>
          {product.first_image && product.first_image !== 'NO IMAGE' && (
            <img src={product.first_image} alt={product.title}
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
          )}
          {/* Secondary image on hover */}
          {product.all_images[1] && (
            <img src={product.all_images[1]} alt=""
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 1 : 0, transition: 'all 0.5s ease' }} />
          )}
          {/* SHOP NOW button on hover */}
          <button type="button" style={{
            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
            padding: '10px 24px', background: 'white', border: 'none',
            fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
            textTransform: 'uppercase', cursor: 'pointer', opacity: hovered ? 1 : 0, transition: 'all 0.5s ease',
          }}>SHOP NOW</button>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, color: '#1a1410', lineHeight: 1.5, marginBottom: '4px' }}>{product.title}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1a1410' }}>{formatPrice(product.price)}</div>
    </Link>
  )
}
