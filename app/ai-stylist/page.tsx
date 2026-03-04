import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIWidget from '@/components/widget/AIWidget'

export const metadata = {
    title: 'AI Stylist | Asuka Couture — Rituals of Fine Dressing',
    description: 'Experience bespoke fashion advice and generative design visualization with our intelligent stylist, Ayaan.',
}

export default function AIStylistPage() {
    return (
        <div style={{ background: '#fdf9f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 md:px-12 mt-16 md:mt-24 max-w-[1200px] mx-auto w-full animate-fadeUp">
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="font-sans text-[#1a1410] text-sm md:text-base font-semibold tracking-[4px] uppercase mb-4 opacity-80">
                        Meet Ayaan
                    </h1>
                    <h2 className="font-serif text-[#1a1410] text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6">
                        Your Personal AI Stylist
                    </h2>
                    <p className="font-sans text-[#5c5046] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Whether you need expert advice on assembling the perfect sangeet look, or want to generate a visual mockup of a bespoke sherwani you've imagined, Ayaan is here to assist.
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto flex-1 h-[600px] mb-20 shadow-[0_20px_40px_rgba(26,20,16,0.05)] rounded-2xl overflow-hidden border border-[#e0d5c8] bg-white">
                    {/* Reusing the AI Widget logic inline, specifically for chat tabs */}
                    <AIWidget initialTab="style" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
