'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application Error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
                <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-4">Something went wrong</h2>
                <p className="font-sans text-sm text-[#7A6A5A] max-w-md mb-8">
                    We experienced an issue loading this page. Our team has been notified.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-[#a17a58] text-white font-mono text-[10px] tracking-[2px] uppercase hover:bg-[#8B6344] transition-colors"
                >
                    Try again
                </button>
            </main>
            <Footer />
        </div>
    )
}
