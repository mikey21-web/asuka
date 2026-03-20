'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getCollectionProducts, type CatalogProduct } from '@/lib/catalog'
import { formatPrice, COLLECTIONS } from '@/lib/site-data'

const COLLECTION_TITLES: Record<string, string> = {
  'bandhgala-suit-for-men': 'BANDHGALA',
  'indowestern-for-men': 'INDO WESTERN',
  'kurta-bundi-set-for-men': 'KURTA BUNDI SET',
  'kurta-set-for-men': 'KURTA SET',
  'sherwani': 'SHERWANI',
  'ethnic-wear-for-men': 'ETHNIC WEAR',
  'celebrity-styles': 'CELEBRITY STYLES',
  'embroidered-shoes-for-men': 'SHOES',
  'embroidered-stoles': 'STOLES',
  'buy-shirts-for-men': 'SHIRTS',
  'co-ord-sets-for-men': 'CO-ORD SETS',
  'buy-tuxedo-suit-for-wedding': 'TUXEDO SETS',
  'suit-set-for-men': 'FORMAL SUITS',
  'casual-suits-for-men': 'CASUAL SUITS',
  'jackets-for-men': 'JACKETS',
  'haldi': 'HALDI',
  'mehendi': 'MEHENDI',
  'sangeet': 'SANGEET',
  'wedding': 'WEDDING',
  'luxury-men-clothing': 'ALL PRODUCTS',
  'new-arrivals': 'NEW ARRIVALS',
  'best-selling-products': 'BEST SELLERS',
  'festive-wear-for-men': 'FESTIVE WEAR',
  'cocktail': 'COCKTAIL',
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'title-asc', label: 'Alphabetically, A–Z' },
  { value: 'title-desc', label: 'Alphabetically, Z–A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
]


export default function CollectionPage() {
  const params = useParams()
  const handle = params.handle as string
  const [sort, setSort] = useState('featured')
  const [sortOpen, setSortOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(24)

  const title = COLLECTION_TITLES[handle] || handle.replace(/-/g, ' ').toUpperCase()

  // Get products from local catalog
  const allProducts = useMemo(() => getCollectionProducts(handle), [handle])

  // Sort
  const sortedProducts = useMemo(() => {
    const arr = [...allProducts]
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      case 'price-desc': return arr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      case 'title-asc': return arr.sort((a, b) => a.title.localeCompare(b.title))
      case 'title-desc': return arr.sort((a, b) => b.title.localeCompare(a.title))
      default: return arr
    }
  }, [allProducts, sort])

  const visibleProducts = sortedProducts.slice(0, visibleCount)
  const hasMore = visibleCount < sortedProducts.length

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />

      {/* Collection Banner */}
      <div style={{ background: '#FAF6F1', paddingTop: '64px', paddingBottom: '48px', textAlign: 'center', borderBottom: '1px solid #f0e8dc' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '4px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '12px' }}>
          ASUKA COUTURE
        </div>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 300, color: '#1a1410', letterSpacing: '4px', margin: 0 }}>
          {title}
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#999', letterSpacing: '2px', marginTop: '16px' }}>
          {sortedProducts.length} PRODUCTS
        </p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-[100] bg-white border-b border-[#eee] px-4 sm:px-8 md:px-12 flex items-center justify-between h-[52px]">
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', letterSpacing: '1px' }}>
          {sortedProducts.length} products
        </span>
        <div style={{ position: 'relative' }} onMouseLeave={() => setSortOpen(false)}>
          <button type="button" onClick={() => setSortOpen(!sortOpen)}
            style={{ background: 'none', border: '1px solid #ddd', padding: '8px 20px', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1410' }}>
            {SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort by'} <span style={{ fontSize: '10px' }}>▾</span>
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', border: '1px solid #eee', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: '220px', zIndex: 200 }}>
              {SORT_OPTIONS.map(o => (
                <button type="button" key={o.value} onClick={() => { setSort(o.value); setSortOpen(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', fontFamily: 'var(--font-sans)', fontSize: '12px',
                    background: sort === o.value ? '#f5f0e8' : 'white', border: 'none', cursor: 'pointer',
                    color: sort === o.value ? '#a17a58' : '#1a1410', borderLeft: sort === o.value ? '2px solid #a17a58' : '2px solid transparent'
                  }}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 sm:px-6 md:px-12 py-8 md:py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-[30px_20px]">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <button type="button" onClick={() => setVisibleCount(v => v + 24)}
              style={{
                padding: '14px 48px', background: 'white', border: '1px solid #1a1410', color: '#1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a1410'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1410' }}>
              LOAD MORE ({sortedProducts.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {sortedProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '120px 0', fontFamily: 'var(--font-sans)', fontSize: '20px', color: '#999' }}>
            No products found in this collection
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
