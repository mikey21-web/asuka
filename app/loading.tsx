import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 rounded-full border-2 border-[#f5ede3] border-t-[#a17a58] animate-spin mb-6"></div>
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#a17a58]">Loading...</p>
            </main>
            <Footer />
        </div>
    )
}
