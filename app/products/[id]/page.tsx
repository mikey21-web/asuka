'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getProductByHandle } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'

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

            {/* Breadcrumb - Clean & Light */}
            <div className="px-5 py-4 sm:px-10 text-[11px] uppercase tracking-[1.5px] font-mono text-[#888] flex items-center gap-2">
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
                                <button className="flex items-center gap-1.5 text-[11px] font-mono tracking-[1px] text-black border-b border-black/20 hover:border-black transition-all">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 12h10M7 8h10M7 16h10M12 7v10" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                                    Size Chart
                                </button>
                            </div>

                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 mb-8">
                                {SIZES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`h-10 text-[11px] border font-mono transition-all duration-300 ${selectedSize === s ? (isWestern ? 'border-[#5f9ea0] bg-[#5f9ea0] text-white' : 'border-black bg-black text-white') : 'border-[#ddd] hover:border-black'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full py-4 border border-[#e53e3e] text-[#e53e3e] text-[11px] font-mono tracking-[2px] uppercase font-bold hover:bg-[#e53e3e] hover:text-white transition-all">
                                    Custom Tailored
                                </button>
                                <button className="w-full py-4 border border-[#a57a5a] text-[#a57a5a] text-[11px] font-mono tracking-[2px] uppercase font-bold hover:bg-[#a57a5a] hover:text-white transition-all">
                                    Download size chart for offline visit
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 mb-12">
                            <button className={`w-full py-5 border ${isWestern ? 'border-[#5f9ea0] text-[#5f9ea0]' : 'border-black text-black'} text-[13px] font-mono tracking-[3px] uppercase font-bold hover:opacity-70 transition-all`}>
                                Add To Cart
                            </button>
                            <button className={`w-full py-5 ${isWestern ? 'bg-[#5f9ea0]' : 'bg-black'} text-white text-[13px] font-mono tracking-[3px] uppercase font-bold hover:opacity-90 transition-all`}>
                                Buy It Now
                            </button>
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
                                    <summary className={`flex justify-between items-center text-[12px] font-mono tracking-[2px] uppercase list-none transition-colors text-[#8f654d]`}>
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
        </div>
    )
}
