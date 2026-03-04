'use client'
import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { OCCASIONS, TRADITIONS, formatPrice } from '@/lib/site-data'
import { getFeaturedProducts, type CatalogProduct } from '@/lib/catalog'

const indoWesterns = getFeaturedProducts('indowestern-for-men', 4)
const sherwanis = getFeaturedProducts('sherwani', 4)
const kurtaBundi = getFeaturedProducts('kurta-bundi-set-for-men', 4)

function ProductCard({ product }: { product: CatalogProduct }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-img-wrap" style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden', background: '#f5f0e8', marginBottom: '10px' }}>
        {product.first_image && product.first_image !== 'NO IMAGE' && (
          <>
            <img src={product.first_image} alt={product.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0,
                transition: 'all 0.5s ease', opacity: hovered && product.all_images[1] ? 0 : 1
              }} />
            {product.all_images[1] && (
              <img src={product.all_images[1]} alt=""
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0,
                  transition: 'all 0.5s ease', opacity: hovered ? 1 : 0
                }} />
            )}
          </>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '10px',
          transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition: 'all 0.5s ease',
          textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
        }}>SHOP NOW</div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#1a1410', lineHeight: 1.4, marginBottom: '4px' }}>{product.title}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1a1410' }}>{formatPrice(product.price)}</div>
    </Link>
  )
}

function FeaturedSection({ title, products, viewAllHref }: { title: string; products: CatalogProduct[]; viewAllHref: string }) {
  return (
    <section style={{ padding: '60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>{title}</h2>
          <Link href={viewAllHref} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#a17a58', textDecoration: 'underline', textUnderlineOffset: '4px', letterSpacing: '1px' }}>View all</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}

export default function EthnicHome() {
  return (
    <>
      <Header />
      <main style={{ background: 'white' }}>

        {/* ═══ SHOP BY OCCASION ═══ */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', textTransform: 'lowercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '40px' }}>shop by occasion</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
              {OCCASIONS.map(occ => (
                <Link key={occ.name} href={occ.href} style={{ textDecoration: 'none', position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f5f0e8', display: 'block' }}>
                  {occ.img && <img src={occ.img} alt={occ.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 400, color: 'white', letterSpacing: '2px', textTransform: 'capitalize' }}>{occ.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TIMELESS TRADITIONS ═══ */}
        <section style={{ padding: '60px 0', background: '#FAF6F1' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', textTransform: 'capitalize', letterSpacing: '2px', textAlign: 'center', marginBottom: '40px' }}>Timeless Traditions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {TRADITIONS.map(t => (
                <Link key={t.name} href={t.href} style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '40px 20px', border: '1px solid #e0d5c8', background: 'white', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a1410'; e.currentTarget.style.color = 'white'; (e.currentTarget.firstChild as HTMLElement).style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1410'; (e.currentTarget.firstChild as HTMLElement).style.color = '#1a1410' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: '#1a1410', transition: 'color 0.3s' }}>{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURED SECTIONS ═══ */}
        <FeaturedSection title="Indo-Western" products={indoWesterns} viewAllHref="/collections/indowestern-for-men" />
        <FeaturedSection title="Rajgharana" products={sherwanis} viewAllHref="/collections/sherwani" />
        <FeaturedSection title="Kurta and Bundi Set" products={kurtaBundi} viewAllHref="/collections/kurta-bundi-set-for-men" />

        {/* Book appointment CTA */}
        <section style={{ padding: '60px 0', textAlign: 'center' }}>
          <a href="https://asukacouture.com/pages/book-an-appointment" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '14px 48px', border: '1px solid #1a1410', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px', textTransform: 'lowercase', color: '#1a1410', textDecoration: 'none' }}>
            book an appointment
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
