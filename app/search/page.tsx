'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { searchProducts, type CatalogProduct } from '@/lib/catalog'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      setLoading(true)
      try {
        const filtered = searchProducts(query)
        setResults(filtered.slice(0, 40))
      } catch (e) {
        console.error('Search error:', e)
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main className="py-12 px-4 sm:px-8 md:px-12">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: 300, color: '#1a1410', marginBottom: '24px' }}>SEARCH</h1>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for products, collections..."
              autoFocus
              style={{ width: '100%', padding: '16px 24px', fontSize: '18px', border: '1px solid #d4c4b0', background: '#FAF6F1', outline: 'none', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            />
            {query && <button type="button" onClick={() => setQuery('')} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', fontSize: '20px' }}>×</button>}
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#a17a58' }}>Searching...</div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {results.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : query && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>No results found for "{query}"</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
