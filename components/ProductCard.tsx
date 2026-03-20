'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/site-data'
import { type CatalogProduct } from '@/lib/catalog'

export default function ProductCard({ product }: { product: CatalogProduct }) {
    const [hovered, setHovered] = useState(false)

    return (
        <Link href={`/products/${product.handle}`} className="block group no-underline"
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

            {/* Image Container */}
            <div className="relative overflow-hidden mb-4 bg-[#f8f8f8] aspect-[2/3] group-hover:shadow-xl transition-all duration-700">
                {product.first_image && product.first_image !== 'NO IMAGE' && (
                    <Image src={product.first_image} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.03]" />
                )}

                {/* Secondary image crossfade */}
                {product.all_images[1] && (
                    <Image src={product.all_images[1]} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover object-top absolute inset-0 transition-opacity duration-700 ease-in-out ${hovered ? 'opacity-100' : 'opacity-0'}`} />
                )}

                {/* SHOP NOW button (appears on hover) */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-[200px] bg-white/95 backdrop-blur-sm 
                        border border-black/10 py-3 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <span className="font-mono text-[10px] tracking-[3px] text-[#1a1410] uppercase font-bold">Quick View</span>
                </div>
            </div>

            {/* Typography Block */}
            <div className="text-center px-2">
                <h3 className="font-serif text-[15px] sm:text-[16px] text-[#1a1410] leading-snug tracking-wide mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    {product.title}
                </h3>
                <p className="font-mono text-[11px] tracking-[2px] text-[#a57a5a]">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    )
}
