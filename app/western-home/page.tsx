'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
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
    <section className={`py-12 sm:py-16 md:py-20 ${bg === '#FAF6F1' ? 'bg-[#FAF6F1]' : ''}`}>
      <div className="page-width mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {subtitle && <div className="font-mono text-[10px] tracking-[4px] text-[#a17a58] uppercase mb-2">{subtitle}</div>}
            <h2 className="font-serif font-light text-[#1a1410] m-0 text-3xl sm:text-4xl">{title}</h2>
          </div>
          <Link href={viewAllHref} className="font-mono text-[10px] tracking-[2px] uppercase text-[#a17a58] no-underline border-b border-[#a17a58] pb-0.5 self-start md:self-auto">View All</Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#888' }} className="px-6 sm:px-10">
          More products coming soon.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }} className="px-6 sm:px-10">
          {products.map(p => (
            <div key={p.id} className="flex-none w-[280px] sm:w-[320px] snap-start">
              <ProductCard product={p} />
            </div>
          ))}
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
        <section className="bg-[#FAF6F1] py-16 md:py-24 px-6 md:px-10">
          <div className="text-center mb-12">
            <div className="font-mono text-[10px] tracking-[4px] text-[#a17a58] uppercase mb-3">COLLECTION</div>
            <h2 className="font-serif font-light text-[#1a1410] m-0 text-3xl sm:text-4xl md:text-5xl">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1400px] mx-auto">
            {CATEGORIES.map(c => (
              <Link key={c.name} href={c.href} className="no-underline block group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={c.img} alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-6">
                    <span className="font-mono text-[12px] tracking-[3px] shadow-sm text-white font-semibold">{c.name}</span>
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
        <section style={{ background: '#1a1410' }} className="py-16 px-6 sm:py-24 sm:px-10">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>VISIT US</div>
          <div style={{ justifyContent: 'center', gap: '40px', marginBottom: '48px' }} className="flex flex-col sm:flex-row flex-wrap">
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
          <div style={{ textAlign: 'center' }}>
            <Link href="/pages/book-an-appointment" style={{ display: 'inline-block', padding: '16px 56px', border: '1px solid #a17a58', color: '#a17a58', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none' }}>
              Book an Appointment
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
