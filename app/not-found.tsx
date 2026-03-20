import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
    return (
        <div style={{ background: 'white', minHeight: '100vh' }}>
            <Header />
            <main className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-[60vh]">
                <div className="font-serif text-[120px] sm:text-[180px] font-light text-[#f5ede3] leading-none select-none">404</div>
                <h1 className="font-serif text-2xl sm:text-4xl font-light tracking-[6px] text-[#1a1410] -mt-8 sm:-mt-12 mb-6">PAGE NOT FOUND</h1>
                <p className="font-sans text-sm text-[#7A6A5A] max-w-md mb-10 leading-relaxed">
                    The page you're looking for might have been moved or no longer exists.
                    Let us help you find your way back to luxury.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/" className="inline-block px-8 py-3 bg-[#a17a58] text-white font-mono text-[10px] tracking-[2px] uppercase no-underline hover:bg-[#8B6344] transition-colors">
                        Return Home
                    </Link>
                    <Link href="/collections/celebrity-styles" className="inline-block px-8 py-3 border border-[#1a1410] text-[#1a1410] font-mono text-[10px] tracking-[2px] uppercase no-underline hover:bg-[#1a1410] hover:text-white transition-colors">
                        Shop Bestsellers
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}
