'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { getProductByHandle } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'
import { SizerPanel } from '@/components/widget/AIWidget'

const BRAND_COPPER = '#a17a58'
const BRAND_INK = '#1a1410'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']

/* ── Brand-to-Asuka size mapping ── */
const BRAND_SIZES: Record<string, Record<string, { asuka: string; confidence: number }>> = {
    'Zara': { 'S': { asuka: 'S', confidence: 90 }, 'M': { asuka: 'M', confidence: 92 }, 'L': { asuka: 'L', confidence: 91 }, 'XL': { asuka: 'XL', confidence: 89 }, '38': { asuka: 'S', confidence: 88 }, '40': { asuka: 'M', confidence: 90 }, '42': { asuka: 'L', confidence: 88 } },
    'H&M': { 'S': { asuka: 'S', confidence: 88 }, 'M': { asuka: 'M', confidence: 90 }, 'L': { asuka: 'L', confidence: 89 }, 'XL': { asuka: 'XL', confidence: 87 } },
    'Uniqlo': { 'S': { asuka: 'M', confidence: 85 }, 'M': { asuka: 'M', confidence: 88 }, 'L': { asuka: 'L', confidence: 87 }, 'XL': { asuka: 'XL', confidence: 86 } },
    'Raymond': { 'S': { asuka: 'S', confidence: 93 }, 'M': { asuka: 'M', confidence: 94 }, 'L': { asuka: 'L', confidence: 93 }, 'XL': { asuka: 'XL', confidence: 92 }, '38': { asuka: 'S', confidence: 91 }, '40': { asuka: 'M', confidence: 93 }, '42': { asuka: 'L', confidence: 92 }, '44': { asuka: 'XL', confidence: 90 } },
    'Allen Solly': { 'S': { asuka: 'S', confidence: 90 }, 'M': { asuka: 'M', confidence: 91 }, 'L': { asuka: 'L', confidence: 90 }, 'XL': { asuka: 'XL', confidence: 89 }, '38': { asuka: 'S', confidence: 88 }, '40': { asuka: 'M', confidence: 90 }, '42': { asuka: 'L', confidence: 89 } },
    'Louis Philippe': { 'S': { asuka: 'S', confidence: 91 }, 'M': { asuka: 'M', confidence: 93 }, 'L': { asuka: 'L', confidence: 92 }, 'XL': { asuka: 'XL', confidence: 90 } },
    'Peter England': { 'S': { asuka: 'S', confidence: 88 }, 'M': { asuka: 'M', confidence: 89 }, 'L': { asuka: 'M', confidence: 85 }, 'XL': { asuka: 'L', confidence: 86 } },
    'Mango': { 'S': { asuka: 'S', confidence: 87 }, 'M': { asuka: 'M', confidence: 89 }, 'L': { asuka: 'L', confidence: 88 }, 'XL': { asuka: 'XL', confidence: 86 } },
    'Van Heusen': { 'S': { asuka: 'S', confidence: 91 }, 'M': { asuka: 'M', confidence: 92 }, 'L': { asuka: 'L', confidence: 91 }, 'XL': { asuka: 'XL', confidence: 90 } },
    'Other': { 'S': { asuka: 'S', confidence: 80 }, 'M': { asuka: 'M', confidence: 82 }, 'L': { asuka: 'L', confidence: 80 }, 'XL': { asuka: 'XL', confidence: 78 } },
}
const BRAND_LIST = Object.keys(BRAND_SIZES)
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '38', '40', '42', '44']
const FIT_OPTIONS = ['Slim Fit', 'Regular Fit', 'Relaxed Fit']

export default function ProductPage() {
    const { id } = useParams()
    const handle = id as string
    const product = getProductByHandle(handle)

    const [selectedSize, setSelectedSize] = useState('')
    const [mainImgIdx, setMainImgIdx] = useState(0)
    const [showAISizer, setShowAISizer] = useState(false)

    // Sizer state — button-based steps

    if (!product) {
        return (
            <>
                <Header />
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffdfd' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', color: BRAND_INK, marginBottom: '16px' }}>Product not found</div>
                        <Link href="/collections/luxury-men-clothing" style={{ color: BRAND_COPPER, fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '1px' }}>← Browse all products</Link>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const images = product.all_images.length > 0 ? product.all_images : (product.first_image !== 'NO IMAGE' ? [product.first_image] : [])

    function calculateSize() { }
    function resetSizer() { }

    const btnBase = { fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #ddd', background: 'white', color: BRAND_INK, padding: '10px 16px' }

    return (
        <>
            <Header />
            <main style={{ background: '#fffdfd', paddingTop: '20px', paddingBottom: '80px' }}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">

                    {/* Breadcrumb */}
                    <nav className="mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', color: '#888' }}>
                        <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 8px' }}>/</span>
                        <span style={{ color: BRAND_INK }}>{product.title}</span>
                    </nav>

                    {/* Product layout — stacks vertically on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">

                        {/* LEFT: Image gallery */}
                        <div>
                            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f0e8', marginBottom: '12px' }}>
                                {images[mainImgIdx] && (
                                    <img src={images[mainImgIdx]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </div>
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                                    {images.map((img, idx) => (
                                        <button type="button" key={idx} onClick={() => setMainImgIdx(idx)}
                                            style={{ flex: '0 0 72px', width: '72px', height: '96px', overflow: 'hidden', border: mainImgIdx === idx ? `2px solid ${BRAND_COPPER}` : '2px solid transparent', cursor: 'pointer', background: '#f5f0e8', padding: 0 }}>
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Product info */}
                        <div className="md:sticky md:top-[100px]">
                            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '26px', fontWeight: 400, color: BRAND_INK, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 16px' }}>
                                {product.title}
                            </h1>
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 500, color: BRAND_INK, marginBottom: '32px' }}>
                                {formatPrice(product.price)}
                            </div>

                            {/* Size selector */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: BRAND_INK, textTransform: 'uppercase', letterSpacing: '1px' }}>Size</span>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <button type="button" onClick={() => setShowAISizer(!showAISizer)}
                                            style={{ background: 'none', border: 'none', color: BRAND_COPPER, fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                            🤖 AI Size Finder
                                        </button>
                                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#999' }}>|</span>
                                        <a href="https://wa.me/919063356542" target="_blank" rel="noopener noreferrer"
                                            style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: BRAND_INK, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                            Custom Size
                                        </a>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                    {SIZES.map(size => (
                                        <button type="button" key={size} onClick={() => setSelectedSize(size)}
                                            style={{
                                                minWidth: '50px', height: '42px', border: selectedSize === size ? `1px solid ${BRAND_INK}` : '1px solid #ddd',
                                                background: selectedSize === size ? BRAND_INK : 'white',
                                                color: selectedSize === size ? 'white' : BRAND_INK,
                                                fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                                            }}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <button type="button" onClick={() => setShowAISizer(!showAISizer)} className="flex items-center gap-2 text-[#a17a58] hover:text-[#1a1410] font-sans text-sm mb-6 pb-1 border-b border-[#a17a58]/30 hover:border-[#1a1410] transition-colors w-fit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                    Find Your Perfect Fit with AI
                                </button>

                                {showAISizer && (
                                    <div className="bg-[#fcf9f6] border border-[#e8e0d6] rounded-xl p-5 mb-8 shadow-sm">
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e8e0d6]">
                                            <h3 className="font-serif text-[#1a1410] text-lg">AI Size Consultant</h3>
                                            <button type="button" onClick={() => setShowAISizer(false)} className="text-[#a17a58] hover:text-[#1a1410] transition-colors">✕</button>
                                        </div>
                                        <SizerPanel />
                                    </div>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                                <button type="button" style={{
                                    width: '100%', height: '54px', background: BRAND_INK, color: 'white', border: 'none',
                                    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = BRAND_COPPER}
                                    onMouseLeave={e => e.currentTarget.style.background = BRAND_INK}>
                                    ADD TO CART
                                </button>
                                <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'make' } }))} style={{
                                    width: '100%', height: '54px', background: 'white', color: BRAND_INK, border: `1px solid ${BRAND_COPPER}`,
                                    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = BRAND_COPPER; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = BRAND_INK; }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        MAKE IT YOURSELF
                                    </span>
                                </button>
                                <a href={`https://wa.me/919063356542?text=Hi, I'm interested in ${encodeURIComponent(product.title)} (${formatPrice(product.price)})`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{
                                        width: '100%', height: '54px', background: '#25D366', color: 'white', border: 'none',
                                        fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none',
                                    }}>
                                    💬 WHATSAPP INQUIRY
                                </a>
                            </div>

                            {/* Description */}
                            <div style={{ borderTop: '1px solid #eee' }}>
                                <details open style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                    <summary style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Description <span>+</span>
                                    </summary>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.6, color: '#666', marginTop: '16px' }}>
                                        {product.description && product.description !== 'No description' && <p className="mb-4"><strong>Details:</strong> {product.description.replace(/<[^>]*>?/gm, '')}</p>}
                                        <p>Crafted with precision, this piece embodies the ritual of fine dressing. Each garment is traditionally tailored holding true to ASUKĀ’s 35 years of heritage.</p>
                                    </div>
                                </details>
                                <details style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                    <summary style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Shipping & Returns <span>+</span>
                                    </summary>
                                    <div style={{ paddingTop: '16px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                        <p>Free shipping on all orders above Rs. 5,000.</p>
                                        <p>30-day hassle-free returns with postage paid.</p>
                                        <p>Custom-sized orders are non-returnable.</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete the Look Cross-Sell */}
                <div className="max-w-[1200px] mx-auto px-4 md:px-10 mt-24">
                    <h3 className="font-serif text-3xl font-light text-[#1a1410] text-center mb-10">Complete the Look</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {['embroidered-shoes-for-men', 'embroidered-shoes-for-men', 'embroidered-stoles', 'embroidered-stoles'].map((col, i) => {
                            const p = getProductByHandle(col === 'embroidered-shoes-for-men' ? (i === 0 ? 'olive-green-velvet-embroidered-shoes' : 'black-velvet-embroidered-shoes') : (i === 2 ? 'ivory-embroidered-stole' : 'maroon-velvet-embroidered-stole'))
                            if (!p) return null
                            return (
                                <Link href={`/products/${p.handle}`} key={p.handle} className="group block no-underline">
                                    <div className="aspect-[2/3] overflow-hidden mb-4 bg-[#f5ede3] product-img-wrap rounded-sm shadow-sm">
                                        <img src={p.first_image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-serif text-sm md:text-base text-[#1a1410] mb-2">{p.title}</h4>
                                        <p className="font-sans text-[11px] text-[#7A6A5A] uppercase tracking-wider">{formatPrice(p.price)}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </main >
            <Footer />
        </>
    )
}
