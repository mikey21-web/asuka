'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getProductByHandle } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'

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
    const [sizerOpen, setSizerOpen] = useState(false)

    // Sizer state — button-based steps
    const [sizerStep, setSizerStep] = useState(1) // 1:brand, 2:size, 3:fit, 4:result
    const [sizerBrand, setSizerBrand] = useState('')
    const [sizerSize, setSizerSize] = useState('')
    const [sizerFit, setSizerFit] = useState('')
    const [recommendedSize, setRecommendedSize] = useState('')
    const [confidence, setConfidence] = useState(0)

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

    function calculateSize() {
        const brandData = BRAND_SIZES[sizerBrand] || BRAND_SIZES['Other']
        const mapping = brandData[sizerSize] || { asuka: sizerSize, confidence: 75 }
        // Adjust confidence based on fit preference
        let adj = mapping.confidence
        if (sizerFit === 'Slim Fit') adj = Math.min(adj + 2, 98)
        if (sizerFit === 'Relaxed Fit') adj = Math.max(adj - 3, 70)
        setRecommendedSize(mapping.asuka)
        setConfidence(adj)
        setSizerStep(4)
    }

    function resetSizer() {
        setSizerStep(1); setSizerBrand(''); setSizerSize(''); setSizerFit('')
        setRecommendedSize(''); setConfidence(0)
    }

    function applySizerResult() {
        setSelectedSize(recommendedSize)
        setSizerOpen(false)
    }

    const btnBase = { fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #ddd', background: 'white', color: BRAND_INK, padding: '10px 16px' }

    return (
        <>
            <Header />
            <main style={{ background: '#fffdfd', paddingTop: '20px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

                    {/* Breadcrumb */}
                    <nav style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', color: '#888' }}>
                        <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 8px' }}>/</span>
                        <span style={{ color: BRAND_INK }}>{product.title}</span>
                    </nav>

                    {/* Product layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

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
                        <div style={{ position: 'sticky', top: '100px' }}>
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
                                        <button type="button" onClick={() => { resetSizer(); setSizerOpen(true) }}
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
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                                {recommendedSize && confidence > 0 && (
                                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f5f0e8', borderLeft: `3px solid ${BRAND_COPPER}` }}>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: BRAND_INK, marginBottom: '6px' }}>
                                            AI recommends: <strong>{recommendedSize}</strong> ({confidence}% confident)
                                        </div>
                                        <div style={{ height: '4px', background: '#e0d5c8', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div className="animate-fillBar" style={{ height: '100%', background: BRAND_COPPER, width: `${confidence}%` }} />
                                        </div>
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
                                    <div style={{ paddingTop: '16px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                        {product.description && product.description !== 'No description'
                                            ? <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                            : 'Individually handcrafted with premium fabrics and artisanal attention to detail.'}
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

                {/* ═══════════════════════════════════════════
            AI SIZER MODAL — BUTTON-BASED STEPS
        ═══════════════════════════════════════════ */}
                {sizerOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
                        onClick={e => { if (e.target === e.currentTarget) setSizerOpen(false) }}>
                        <div style={{ width: '440px', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="animate-panelOpen">

                            {/* Header */}
                            <div style={{ padding: '18px 20px', background: BRAND_INK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: 'white', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, margin: 0, letterSpacing: '1px' }}>🤖 AI SIZE FINDER</h3>
                                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>for {product.title}</div>
                                </div>
                                <button type="button" onClick={() => setSizerOpen(false)} style={{ color: 'white', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>×</button>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ display: 'flex', gap: '4px', padding: '16px 20px 0' }}>
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: sizerStep >= s ? BRAND_COPPER : '#e0d5c8', transition: 'background 0.3s' }} />
                                ))}
                            </div>

                            {/* Body */}
                            <div style={{ padding: '20px', minHeight: '320px' }}>

                                {/* STEP 1: Select Brand */}
                                {sizerStep === 1 && (
                                    <div className="animate-fadeUp">
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, color: BRAND_INK, marginBottom: '6px' }}>Which brand do you wear?</div>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', marginBottom: '20px' }}>This helps us map your size accurately</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {BRAND_LIST.map(brand => (
                                                <button type="button" key={brand} onClick={() => { setSizerBrand(brand); setSizerStep(2) }}
                                                    style={{
                                                        ...btnBase, padding: '14px 16px', textAlign: 'left', fontWeight: sizerBrand === brand ? 600 : 400,
                                                        border: sizerBrand === brand ? `1px solid ${BRAND_COPPER}` : '1px solid #e0d5c8',
                                                        background: sizerBrand === brand ? '#f5f0e8' : 'white'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND_COPPER; e.currentTarget.style.background = '#faf6f1' }}
                                                    onMouseLeave={e => { if (sizerBrand !== brand) { e.currentTarget.style.borderColor = '#e0d5c8'; e.currentTarget.style.background = 'white' } }}>
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Select Size in that brand */}
                                {sizerStep === 2 && (
                                    <div className="animate-fadeUp">
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, color: BRAND_INK, marginBottom: '6px' }}>Your size in {sizerBrand}?</div>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', marginBottom: '20px' }}>Select the size you usually wear</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                            {SIZE_OPTIONS.map(size => (
                                                <button type="button" key={size} onClick={() => { setSizerSize(size); setSizerStep(3) }}
                                                    style={{
                                                        ...btnBase, padding: '12px', textAlign: 'center', fontWeight: 500,
                                                        border: sizerSize === size ? `1px solid ${BRAND_COPPER}` : '1px solid #e0d5c8',
                                                        background: sizerSize === size ? BRAND_INK : 'white',
                                                        color: sizerSize === size ? 'white' : BRAND_INK
                                                    }}
                                                    onMouseEnter={e => { if (sizerSize !== size) { e.currentTarget.style.borderColor = BRAND_COPPER } }}
                                                    onMouseLeave={e => { if (sizerSize !== size) { e.currentTarget.style.borderColor = '#e0d5c8' } }}>
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => setSizerStep(1)} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#888', fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer' }}>← Back to brand</button>
                                    </div>
                                )}

                                {/* STEP 3: Fit preference */}
                                {sizerStep === 3 && (
                                    <div className="animate-fadeUp">
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, color: BRAND_INK, marginBottom: '6px' }}>How do you like your fit?</div>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', marginBottom: '20px' }}>This fine-tunes our recommendation</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {FIT_OPTIONS.map(fit => (
                                                <button type="button" key={fit} onClick={() => { setSizerFit(fit); calculateSize() }}
                                                    style={{ ...btnBase, padding: '16px 20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND_COPPER; e.currentTarget.style.background = '#faf6f1' }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0d5c8'; e.currentTarget.style.background = 'white' }}>
                                                    <span style={{ fontWeight: 500 }}>{fit}</span>
                                                    <span style={{ fontSize: '11px', color: '#888' }}>
                                                        {fit === 'Slim Fit' ? 'Tailored, close to body' : fit === 'Regular Fit' ? 'Classic, comfortable' : 'Loose, relaxed'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => setSizerStep(2)} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#888', fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer' }}>← Back to size</button>
                                    </div>
                                )}

                                {/* STEP 4: Result */}
                                {sizerStep === 4 && (
                                    <div className="animate-fadeUp" style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Your Perfect Asuka Size</div>
                                        <div style={{ fontSize: '64px', fontFamily: 'var(--font-sans)', fontWeight: 600, color: BRAND_INK, marginBottom: '8px' }}>{recommendedSize}</div>

                                        {/* Confidence bar */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
                                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#888' }}>Confidence</span>
                                            <div style={{ width: '120px', height: '4px', background: '#e0d5c8', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div className="animate-fillBar" style={{ height: '100%', background: confidence > 85 ? '#27ae60' : BRAND_COPPER, width: `${confidence}%` }} />
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: confidence > 85 ? '#27ae60' : BRAND_COPPER }}>{confidence}%</span>
                                        </div>

                                        {/* Summary */}
                                        <div style={{ background: '#f5f0e8', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: BRAND_INK, lineHeight: 1.7 }}>
                                                Based on your <strong>{sizerSize}</strong> in <strong>{sizerBrand}</strong> with a <strong>{sizerFit.toLowerCase()}</strong> preference, we recommend <strong>Asuka size {recommendedSize}</strong>.
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button type="button" onClick={applySizerResult}
                                                style={{ width: '100%', padding: '14px', background: BRAND_INK, color: 'white', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = BRAND_COPPER}
                                                onMouseLeave={e => e.currentTarget.style.background = BRAND_INK}>
                                                SELECT SIZE {recommendedSize} →
                                            </button>
                                            <button type="button" onClick={resetSizer}
                                                style={{ width: '100%', padding: '12px', background: 'white', color: BRAND_INK, border: `1px solid #ddd`, fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer' }}>
                                                Start Over
                                            </button>
                                            <a href="https://wa.me/919063356542" target="_blank" rel="noopener noreferrer"
                                                style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                                                💬 Talk to a size expert on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}
