'use client'
import { useState, useEffect } from 'react'

export default function ScrollToTop() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 400)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!show) return null

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9990] w-10 h-10 rounded-full bg-[#1a1410]/80 backdrop-blur-sm text-white border border-[#a17a58]/30 flex items-center justify-center shadow-lg hover:bg-[#a17a58] transition-all duration-300 animate-fadeUp"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
    )
}
