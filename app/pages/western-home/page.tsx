'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIWidget from '@/components/widget/AIWidget'
import { HERO_WESTERN } from '@/lib/site-data'

import { getFeaturedProducts, type CatalogProduct } from '@/lib/catalog'

function fmt(p: string) {
  return `Rs. ${parseFloat(p).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function ProductRow({
  title, subtitle, collectionHandle, viewAllHref, bg = 'white',
}: { title: string; subtitle?: string; collectionHandle: string; viewAllHref: string; bg?: string }) {
  const products = getFeaturedProducts(collectionHandle, 6)

  return (
    <section style={{ padding: '80px 0', background: bg }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 60px', marginBottom: '40px' }}>
        <div>
          {subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '10px' }}>{subtitle}</div>}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 300, color: '#1a1410', margin: 0 }}>{title}</h2>
        </div>
        <Link href={viewAllHref} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a17a58', textDecoration: 'none', borderBottom: '1px solid #a17a58', paddingBottom: '2px' }}>View All</Link>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '0 60px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#888' }}>
          More products coming soon.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '0 60px 16px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {products.map(p => {
            return (
              <Link key={p.id} href={`/products/${p.handle}`} style={{ flex: '0 0 280px', scrollSnapAlign: 'start', textDecoration: 'none', display: 'block' }}>
                <div className="product-img-wrap" style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden', marginBottom: '14px', background: '#f5f0e8' }}>
                  {p.first_image && p.first_image !== 'NO IMAGE' && (
                    <img src={p.first_image} alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1410', lineHeight: 1.4, marginBottom: '6px' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1410' }}>{fmt(p.price || '0')}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </section>
  )
}

const CATEGORIES = [
  { name: 'SHIRTS', href: '/collections/buy-shirts-for-men', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/AUSK122490_1.avif?v=1757270217' },
  { name: 'CO-ORD SETS', href: '/collections/co-ord-sets-for-men', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/2E50C0D2-240E-426C-8DB8-8A03D67F5BE7.png?v=1735417158' },
  { name: 'TUXEDO SETS', href: '/collections/buy-tuxedo-suit-for-wedding', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/M-16-0674.jpg?v=1743811378' },
  { name: 'FORMAL SUITS', href: '/collections/suit-set-for-men', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/IMG-7174.png?v=1735414274' },
  { name: 'CASUAL SUITS', href: '/collections/casual-suits-for-men', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/ASUKA21958.jpg?v=1748011564' },
  { name: 'JACKETS', href: '/collections/jackets-for-men', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/IMG-7179.png?v=1735414720' },
]

export default function WesternHome() {
  return (
    <>
      <Header />
      <main style={{ background: 'white' }}>

        {/* ── Hero Media (matching live site) ── */}
        <section style={{ position: 'relative', height: '550px', overflow: 'hidden', background: '#0d0d0d' }}>
          <img
            src={HERO_WESTERN}
            alt="Western Wear Hero"
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))', zIndex: 3 }} />
        </section>

        {/* ── Shop by Category – 3-col grid ── */}
        <section style={{ background: '#FAF6F1', padding: '80px 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '12px' }}>COLLECTION</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: 300, color: '#1a1410', margin: 0 }}>Shop by Category</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            {CATEGORIES.map(c => (
              <Link key={c.name} href={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '3px', color: 'white', fontWeight: 600 }}>{c.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── LIVE product rows from Shopify ── */}
        <ProductRow title="Sins of Stardust" subtitle="EMBELLISHED TUXEDOS" collectionHandle="sins-of-stardust" viewAllHref="/collections/sins-of-stardust" />
        <ProductRow title="Primavera" subtitle="LINEN & SILK SHIRTS" collectionHandle="primavera-menswear" viewAllHref="/collections/buy-shirts-for-men" bg="#FAF6F1" />
        <ProductRow title="Formal Suits" subtitle="SUITING" collectionHandle="suit-set-for-men" viewAllHref="/collections/suit-set-for-men" />
        <ProductRow title="Casual Suits" subtitle="RELAXED TAILORING" collectionHandle="casual-suits-for-men" viewAllHref="/collections/casual-suits-for-men" bg="#FAF6F1" />

        {/* ── Store + Appointment CTA ── */}
        <section style={{ background: '#1a1410', padding: '100px 60px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '16px' }}>VISIT US</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '48px', flexWrap: 'wrap' }}>
            {[
              { city: 'MUMBAI', area: 'S.V Road, Santacruz West', map: 'https://maps.app.goo.gl/XxKsrqs3pzGzHX8g9' },
              { city: 'HYDERABAD', area: 'Road No. 2, Banjara Hills', map: 'https://maps.app.goo.gl/nEV8AzH19hFMDpgNA' },
              { city: 'AHMEDABAD', area: 'Panchvati Circle, C.G. Road', map: 'https://maps.app.goo.gl/BXZEYFERMdDnucyb7' },
            ].map(s => (
              <div key={s.city} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'white', fontWeight: 600, marginBottom: '6px' }}>{s.city}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>{s.area}</div>
                <a href={s.map} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: '#a17a58', textDecoration: 'none', borderBottom: '1px solid #a17a58', paddingBottom: '2px' }}>Get Directions</a>
              </div>
            ))}
          </div>
          <Link href="/pages/book-an-appointment" style={{ display: 'inline-block', padding: '16px 56px', border: '1px solid #a17a58', color: '#a17a58', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none' }}>
            Book an Appointment
          </Link>
        </section>

      </main>
      <Footer />
      <AIWidget />
    </>
  )
}
