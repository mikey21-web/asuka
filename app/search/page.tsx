'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIWidget from '@/components/widget/AIWidget'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/data/all-products.json')
        const all = await res.json()
        const filtered = all.filter((p: any) => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.product_type?.toLowerCase().includes(query.toLowerCase()) ||
          (Array.isArray(p.tags) ? p.tags : (p.tags?.split(', ') || [])).some((t: string) => t.toLowerCase().includes(query.toLowerCase()))
        )
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
      <main style={{ padding: '80px 48px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
              {results.map(p => (
                <Link key={p.id} href={`/products/${p.handle}`} style={{ textDecoration: 'none' }}>
                  <div style={{ aspectRatio: '2/3', background: '#f5f0e8', marginBottom: '12px', overflow: 'hidden' }}>
                    <img src={p.images[0]?.src} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#a17a58', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '14px', color: '#1a1410', fontWeight: 600 }}>Rs. {parseFloat(p.variants[0].price).toLocaleString('en-IN')}</div>
                </Link>
              ))}
            </div>
          ) : query && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>No results found for "{query}"</div>
          )}
        </div>
      </main>
      <Footer />
      <AIWidget />
    </div>
  )
}
