'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SizerPanel } from '../widget/AIWidget'
import { ASUKA_PRODUCTS } from '@/lib/groq'

const BRAND_COPPER = '#a17a58'
const BRAND_INK = '#1a1410'

export default function DigitalStylistSection() {
    const [activeTab, setActiveTab] = useState<'style' | 'size' | 'make'>('style')

    return (
        <section className="py-20 sm:py-28 bg-[#FAF6F1] overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="animate-fadeRight">
                        <div className="font-mono text-[10px] tracking-[5px] text-[#a17a58] uppercase mb-6">Experience Asuka AI</div>
                        <h2 className="font-serif font-light text-[#1a1410] text-4xl sm:text-5xl md:text-6xl mb-8 leading-[1.1]">
                            Your Personal <br />
                            <em className="font-italic opacity-80">Digital Atelier</em>
                        </h2>
                        <p className="font-sans text-[#555] text-lg leading-relaxed mb-10 max-w-[500px]">
                            From finding your perfect fit across global brands to designing a bespoke masterpiece from scratch—our AI-powered studio brings 35 years of heritage into your hands.
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                { id: 'style', label: 'AI Style Consultant', desc: 'Personalized occasion styling & curation.' },
                                { id: 'size', label: 'AI Sizer Finder', desc: 'Map your size from any brand to Asuka.' },
                                { id: 'make', label: 'Make It Yourself', desc: 'Design your own custom garment with AI.' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`text-left p-6 transition-all duration-300 border-l-2 ${activeTab === item.id ? 'bg-white border-[#a17a58] shadow-sm' : 'border-transparent hover:border-[#a17a58]/30'}`}
                                >
                                    <div className={`font-mono text-[10px] tracking-widest uppercase mb-1 ${activeTab === item.id ? 'text-[#a17a58]' : 'text-[#999]'}`}>
                                        {item.id === 'style' ? 'Chat' : item.id === 'size' ? 'Fit' : 'Design'}
                                    </div>
                                    <div className="font-sans font-medium text-[#1a1410] mb-1">{item.label}</div>
                                    <div className="font-sans text-xs text-[#777]">{item.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Interactive Widget Area */}
                    <div className="relative">
                        {/* Background Decoration */}
                        <div className="absolute -inset-10 bg-white/40 blur-3xl rounded-full -z-10" />

                        <div className="bg-white border border-[#e8dfd5] shadow-2xl rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
                            {activeTab === 'size' ? (
                                <div className="p-8 sm:p-10 flex-1">
                                    <h3 className="font-serif text-2xl text-[#1a1410] mb-8">AI Fit Finder</h3>
                                    <SizerPanel />
                                </div>
                            ) : (
                                <div className="p-8 sm:p-10 flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-[#FAF6F1] rounded-full flex items-center justify-center mb-6">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={BRAND_COPPER} strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                    <h3 className="font-serif text-2xl text-[#1a1410] mb-4">
                                        {activeTab === 'style' ? 'Consult with Ayaan' : 'Enter the Atelier'}
                                    </h3>
                                    <p className="font-sans text-[#777] text-sm mb-10 max-w-[300px]">
                                        Our specialized AI interfaces are optimized for deep conversation and design generation.
                                    </p>
                                    <Link
                                        href={activeTab === 'style' ? '/ai-stylist' : '/make-it-yourself'}
                                        className="inline-block px-10 py-4 bg-[#1a1410] text-white font-mono text-[11px] tracking-[3px] uppercase hover:bg-[#a17a58] transition-colors duration-300 no-underline"
                                    >
                                        Launch {activeTab === 'style' ? 'Stylist' : 'Atelier'} →
                                    </Link>
                                </div>
                            )}

                            {/* Widget Footer */}
                            <div className="px-8 py-4 bg-[#FAF6F1]/50 border-t border-[#eee] flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#aaa] tracking-wider uppercase">Powered by Asuka AI</span>
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                                    <span className="font-mono text-[9px] text-[#25D366] uppercase">Live Expert Handover</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
