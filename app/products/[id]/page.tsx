'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getProductByHandle } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'

import ProductSizerModal from '@/components/ai/ProductSizerModal'

const TEAL = '#008b8b'
const ETHNIC_BROWN = '#8f654d'
const DARK_INK = '#1a1410'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']

export default function ProductPage() {
    const { id } = useParams()
    const handle = id as string
    const product = getProductByHandle(handle)
    const [selectedSize, setSelectedSize] = useState('XS')
    const [mainImgIdx, setMainImgIdx] = useState(0)
    const [sizerOpen, setSizerOpen] = useState(false)
    const [aiRecommendedSize, setAiRecommendedSize] = useState<string | null>(null)

    // Phase 2.3: Listen for AI Sizer recommendations
    useEffect(() => {
        const handleSizeRec = (e: any) => {
            const size = e.detail?.size;
            if (size && SIZES.includes(size.toUpperCase())) {
                const upperSize = size.toUpperCase();
                setSelectedSize(upperSize);
                setAiRecommendedSize(upperSize);
                // Scroll to size selector if needed
                console.log('AI Recommended Size Received:', upperSize);
            }
        };
        window.addEventListener('asuka:size-recommended', handleSizeRec);
        return () => window.removeEventListener('asuka:size-recommended', handleSizeRec);
    }, []);

    // Category detection: shirts, co-ord, tuxedo, suits, jackets = Western
    const isWestern = handle.includes('shirt') || handle.includes('suit') || handle.includes('jacket') || handle.includes('tuxedo') || handle.includes('co-ord') || handle.includes('western')

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="font-serif">Loading masterpiece...</h1>
        </div>
    )

    const images = product.all_images && product.all_images.length > 0 ? product.all_images : [product.first_image]

    return (
        <div className="bg-white min-h-screen text-[#1a1410]">
            <Header />

            {/* Breadcrumb - Clean & Light with top padding for header clearance */}
            <div className="pt-[80px] sm:pt-[100px] px-5 py-4 sm:px-10 text-[11px] uppercase tracking-[1.5px] font-mono text-[#888] flex items-center gap-2">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span>/</span>
                <span className="text-black truncate max-w-[200px]">{product.title}</span>
            </div>

            <main className="max-w-[1700px] mx-auto px-4 md:px-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-14">

                    {/* COL 1: Vertical Thumbnails (Desktop Only) */}
                    <div className="hidden lg:flex flex-col gap-3 w-[70px] flex-shrink-0">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImgIdx(idx)}
                                className={`aspect-[2/3] border overflow-hidden transition-all duration-300 ${mainImgIdx === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* COL 2: Main Image Block */}
                    <div className="flex-1 lg:flex-[0.55]">
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#fafafa]">
                            <img
                                src={images[mainImgIdx]}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700"
                            />
                        </div>
                        {/* Horizontal thumbs for mobile */}
                        <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2 px-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImgIdx(idx)}
                                    className={`flex-shrink-0 w-20 aspect-[2/3] border overflow-hidden ${mainImgIdx === idx ? 'border-black' : 'border-transparent opacity-60'}`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* COL 3: Product Info */}
                    <div className="flex-1 lg:flex-[0.45] flex flex-col pt-0 lg:pt-4">
                        <h1 className="font-serif text-[24px] sm:text-[32px] md:text-[38px] leading-[1.1] mb-2 tracking-wide font-normal uppercase">
                            {product.title}
                        </h1>

                        <div className="text-[12px] font-mono tracking-[2px] text-[#888] mb-6 uppercase">
                            {product.handle.split('-').slice(0, 2).join('-').toUpperCase()}
                        </div>

                        <div className="mb-6">
                            <span className="font-serif text-[20px] md:text-[24px] text-[#1a1410]">{formatPrice(product.price)}</span>
                            <p className="text-[10px] sm:text-[11px] font-mono tracking-[1px] text-[#888] mt-1">Tax included. Shipping calculated at checkout.</p>
                        </div>

                        {/* Size Section */}
                        <div className="mb-10 pt-6 border-t border-[#eee]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] sm:text-[12px] font-mono tracking-[3px] uppercase font-bold text-[#1a1410]">Size</span>
                                <Link href="/sizing" className="flex items-center gap-1.5 text-[11px] font-mono tracking-[1px] text-black border-b border-black/20 hover:border-black transition-all no-underline">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 12h10M7 8h10M7 16h10M12 7v10" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                                    Size Chart
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {SIZES.map(s => {
                                    const isRecommended = aiRecommendedSize === s;
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`w-11 h-11 flex flex-col items-center justify-center text-[12px] border font-mono transition-all duration-300 relative ${selectedSize === s ? (isWestern ? 'border-[#008b8b] bg-[#008b8b] text-white' : 'border-black bg-black text-white') : 'border-[#ccc] hover:border-black'} ${isRecommended ? 'ring-2 ring-[var(--gold)] ring-offset-2' : ''}`}
                                        >
                                            {s}
                                            {isRecommended && (
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-white text-[7px] px-1.5 py-0.5 rounded whitespace-nowrap animate-bounce">
                                                    ✦ RECOMMENDED
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full py-4 border border-[#e53e3e] text-[#e53e3e] text-[11px] font-mono tracking-[2px] uppercase font-bold hover:bg-[#e53e3e] hover:text-white transition-all">
                                    Custom Tailored
                                </button>
                                <Link href="/sizing" className="w-full py-4 border border-[#a57a5a] text-[#a57a5a] text-[11px] font-mono tracking-[2px] uppercase font-bold hover:bg-[#a57a5a] hover:text-white transition-all text-center no-underline">
                                    View Detailed Size Guide
                                </Link>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2.5 mb-10">
                            <button className={`w-full py-4 border ${isWestern ? 'border-[#008b8b] text-[#008b8b]' : 'border-black text-black'} text-[12px] font-mono tracking-[3px] uppercase font-bold hover:opacity-70 transition-all`}>
                                Add To Cart
                            </button>
                            <button className={`w-full py-4 ${isWestern ? 'bg-[#008b8b]' : 'bg-black'} text-white text-[12px] font-mono tracking-[3px] uppercase font-bold hover:opacity-90 transition-all`}>
                                Buy It Now
                            </button>
                            <button
                                onClick={() => setSizerOpen(true)}
                                className={`w-full py-3 border border-[var(--gold)] text-[var(--gold)] text-[11px] font-mono tracking-[2px] uppercase hover:bg-[var(--gold-dim)] transition-colors my-2`}
                            >
                                ✦ Find My Size with AI
                            </button>
                            <Link
                                href="/make-it-yourself"
                                className="w-full py-4 bg-[#8f654d] text-white text-[11px] font-mono tracking-[3px] uppercase font-bold hover:opacity-90 transition-all text-center no-underline mt-2 flex items-center justify-center gap-2"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7-7-7M5 12h14" /></svg>
                                Make It Yourself (MIY)
                            </Link>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-[#eee]">
                            {[
                                { title: 'Description', content: product.description || "Indulge in luxury with ASUKĀ's master-tailored collection." },
                                { title: '1. Delivery Time', content: 'Each piece is hand-tailored and takes 15-20 business days to reach your doorstep.' },
                                { title: '2. Disclaimer', content: 'Slight variations in color/embroidery may occur as these are genuine hand-crafted luxury pieces.' },
                                { title: '3. Care', content: 'Dry clean only. Store in a cool, dry place away from direct sunlight.' }
                            ].map((item, i) => (
                                <details key={i} className="group border-b border-[#eee] py-4 cursor-pointer">
                                    <summary className={`flex justify-between items-center text-[12px] font-mono tracking-[2px] uppercase list-none transition-colors text-[var(--gold)]`}>
                                        {item.title}
                                        <span className="text-xl font-light scale-y-75 group-open:rotate-45 transition-transform">+</span>
                                    </summary>
                                    <div className="mt-4 text-[14px] font-serif leading-relaxed text-[#555] pr-4">
                                        {item.content.replace(/<[^>]*>?/gm, '')}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <ProductSizerModal isOpen={sizerOpen} onClose={() => setSizerOpen(false)} />
        </div>
    )
}
