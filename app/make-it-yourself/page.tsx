'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BRAND_COPPER = '#a17a58'
const BRAND_INK = '#1a1410'
const BG_CREAM = '#fffdfd'

interface Look {
    name: string
    direction: string
    fabric_notes: string
    addons: string[]
    image_url: string
}

export default function MakeItYourself() {
    const [step, setStep] = useState(1)

    // Step 1: Occasion & Vibe
    const [occasion, setOccasion] = useState('Wedding Guest')
    const [location, setLocation] = useState('Indoor')
    const [city, setCity] = useState('')
    const [time, setTime] = useState('Evening')
    const [vibe, setVibe] = useState(50) // 0: Classic, 100: Bold
    const [colors, setColors] = useState('Navy, Emerald')
    const [avoidColors, setAvoidColors] = useState('Yellow')
    const [budget, setBudget] = useState('₹50k - ₹1L')

    // Step 2: Personal Inputs
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [skin, setSkin] = useState('Medium')
    const [fit, setFit] = useState('Slim Tailored')
    const [ownedItems, setOwnedItems] = useState('')

    // Step 3: Chat & AI Looks
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [looks, setLooks] = useState<Look[]>([])
    const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([])
    const [imagePrompt, setImagePrompt] = useState<string | null>(null)

    // Step 4: Concept Img
    const [selectedLook, setSelectedLook] = useState<Look | null>(null)
    const [conceptImg, setConceptImg] = useState<string | null>(null)
    const [imgLoading, setImgLoading] = useState(false)

    // Step 5: Customize & Handover
    const [lapel, setLapel] = useState('Peak Satin Lapel')
    const [buttons, setButtons] = useState('Fabric Covered')
    const [embroidery, setEmbroidery] = useState('Subtle Threadwork')
    const [lining, setLining] = useState('Printed Silk')
    const [monogram, setMonogram] = useState('')

    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (step === 3) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatLog, loading, step])

    const handleChat = async () => {
        if (!msg.trim()) return
        setLoading(true)
        const userMsg = { role: 'user', content: msg }
        setChatLog(prev => [...prev, userMsg])
        setMsg('')

        try {
            const res = await fetch('/api/miy-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: { occasion, location, city, time, vibe, colors, avoidColors, budget, height, weight, skin, fit, ownedItems },
                    message: msg,
                    history: chatLog
                })
            })
            const data = await res.json()
            setChatLog(prev => [...prev, { role: 'assistant', content: data.message }])
            if (data.looks) setLooks(data.looks)
            if (data.image_prompt) setImagePrompt(data.image_prompt)
        } catch (err) {
            setChatLog(prev => [...prev, { role: 'assistant', content: "My apologies, the atelier is currently busy. Could we try that again?" }])
        }
        setLoading(false)
    }

    const generateConcept = async (look: Look) => {
        setSelectedLook(look)
        setStep(4)
        setImgLoading(true)

        // Generate via Pollinations/Flux for better conceptual quality
        const prompt = imagePrompt || `luxury ${look.name} outfit, ${look.direction}, ${look.fabric_notes}, editorial fashion photography, studio background, 8k`
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1344&nologo=true&seed=${Date.now()}`

        // Preload image
        const img = new Image()
        img.src = url
        img.onload = () => {
            setConceptImg(url)
            setImgLoading(false)
        }
        img.onerror = () => {
            console.error("Failed to load concept image")
            setImgLoading(false)
            // Fallback to a placeholder or stay on chat
            alert("The visualization atelier is currently backlogged. We've captured your design details!")
        }
    }

    const finalizeBrief = () => {
        return `Namaste! My Bespoke Design Brief:
--------------------------------
OCCASION: ${occasion} in ${city || 'Indoors'}
VIBE: ${vibe < 40 ? 'Classic' : vibe > 60 ? 'Bold' : 'Balanced'}
BUDGET: ${budget}
COLORS: ${colors} (Avoid: ${avoidColors})

CLIENT: ${height}/${weight} | ${skin} skin | ${fit} fit
OWNING: ${ownedItems || 'None mentioned'}

CHOSEN LOOK: ${selectedLook?.name}
DETAILS: ${lapel}, ${buttons} buttons, ${embroidery} embroidery, ${lining} lining.
MONOGRAM: ${monogram || 'None'}

Please connect me with a tailor to finalize.`
    }

    const inputClasses = "w-full border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#a17a58] transition-colors text-sm font-light placeholder:text-gray-300"
    const labelClasses = "block text-[10px] uppercase tracking-[2px] text-[#a17a58] mb-1 font-medium"

    return (
        <div className="min-h-screen bg-[#fffdfd] transition-all duration-700">
            <Header />

            <main className="pt-40 pb-20 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Progress Header */}
                    <div className="text-center mb-16">
                        <span className="text-[10px] uppercase tracking-[4px] text-[#a17a58] mb-4 block">Asuka Atelier</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-[#1a1410] mb-8 font-light italic">Make It Yourself</h1>
                        <div className="flex justify-center items-center gap-2 md:gap-4">
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} className="flex items-center gap-2 md:gap-4">
                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[8px] md:text-[10px] transition-all duration-500 ${step >= s ? 'bg-[#1a1410] border-[#1a1410] text-white shadow-lg' : 'border-gray-200 text-gray-400'}`}>
                                        {s}
                                    </div>
                                    {s < 5 && <div className={`w-4 md:w-8 h-[1px] ${step > s ? 'bg-[#1a1410]' : 'bg-gray-200'}`} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 rounded-sm min-h-[500px] relative overflow-hidden">

                        {/* Step 1: Occasion & Vibe */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-serif italic mb-6">The Occasion</h2>
                                        <div>
                                            <label className={labelClasses}>What is the Event?</label>
                                            <select className={inputClasses} value={occasion} onChange={e => setOccasion(e.target.value)}>
                                                {['Wedding Guest', 'Groom', 'Cocktail', 'Reception', 'Engagement', 'Corporate', 'Festive'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClasses}>Location</label>
                                                <select className={inputClasses} value={location} onChange={e => setLocation(e.target.value)}>
                                                    {['Indoor', 'Outdoor', 'Beach', 'Mountain'].map(o => <option key={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>City</label>
                                                <input className={inputClasses} placeholder="e.g. Jaipur" value={city} onChange={e => setCity(e.target.value)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Time of Day</label>
                                            <div className="flex gap-2 mt-2">
                                                {['Day', 'Night'].map(t => (
                                                    <button key={t} onClick={() => setTime(t)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest border transition-all ${time === t ? 'bg-[#1a1410] text-white border-[#1a1410]' : 'border-gray-200 text-gray-400 hover:border-[#a17a58]'}`}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h2 className="text-xl font-serif italic mb-6">The Aesthetic</h2>
                                        <div>
                                            <label className={labelClasses}>Vibe Preference</label>
                                            <div className="flex justify-between text-[8px] uppercase tracking-tighter text-gray-400 mb-2">
                                                <span>Minimalist</span>
                                                <span>Bold</span>
                                            </div>
                                            <input type="range" className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-[#a17a58]" value={vibe} onChange={e => setVibe(Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Color Palette</label>
                                            <input className={inputClasses} placeholder="Preferred colors..." value={colors} onChange={e => setColors(e.target.value)} />
                                            <input className={inputClasses} placeholder="Colors to avoid..." value={avoidColors} onChange={e => setAvoidColors(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Budget Window</label>
                                            <select className={inputClasses} value={budget} onChange={e => setBudget(e.target.value)}>
                                                {['₹30k - ₹50k', '₹50k - ₹1L', '₹1L - ₹2.5L', '₹2.5L+'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-end">
                                    <button onClick={() => setStep(2)} className="bg-[#1a1410] text-white px-12 py-4 text-xs uppercase tracking-[3px] hover:bg-[#a17a58] transition-all flex items-center gap-2 group">
                                        Personal Inputs <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal Inputs */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                                <h2 className="text-2xl font-serif italic mb-8 text-center">Your Canvas</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClasses}>Height (ft/in)</label>
                                                <input className={inputClasses} placeholder="e.g. 5'11" value={height} onChange={e => setHeight(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Weight (kg)</label>
                                                <input className={inputClasses} placeholder="e.g. 78kg" value={weight} onChange={e => setWeight(e.target.value)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Skin Tone</label>
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                {[
                                                    { id: 'Fair', color: '#F8E2CF' },
                                                    { id: 'Medium', color: '#E8C19D' },
                                                    { id: 'Tan', color: '#B07D4F' },
                                                    { id: 'Deep', color: '#6B4226' }
                                                ].map(s => (
                                                    <button key={s.id} onClick={() => setSkin(s.id)} className="flex flex-col items-center gap-2 group">
                                                        <div className={`w-10 h-10 rounded-full transition-all border ${skin === s.id ? 'border-[#a17a58] scale-110 shadow-md ring-4 ring-white' : 'border-transparent'}`} style={{ background: s.color }} />
                                                        <span className={`text-[8px] uppercase tracking-tighter ${skin === s.id ? 'text-[#a17a58] font-bold' : 'text-gray-400'}`}>{s.id}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <label className={labelClasses}>Fit Preference</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                {['Extra Slim', 'Slim Tailored', 'Classic', 'Relaxed'].map(f => (
                                                    <button key={f} onClick={() => setFit(f)} className={`py-3 text-[9px] uppercase tracking-widest border transition-all ${fit === f ? 'bg-[#1a1410] text-white border-[#1a1410]' : 'border-gray-200 text-gray-400 hover:border-[#a17a58]'}`}>
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Owned Items to Match</label>
                                            <input className={inputClasses} placeholder="e.g. Gold watch, brown loafers..." value={ownedItems} onChange={e => setOwnedItems(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4">
                                    <button onClick={() => setStep(1)} className="px-8 py-4 text-xs uppercase tracking-[3px] text-gray-400 hover:text-[#a17a58] transition-all order-2 sm:order-1">← Back</button>
                                    <button onClick={() => setStep(3)} className="bg-[#1a1410] text-white px-12 py-4 text-xs uppercase tracking-[3px] hover:bg-[#a17a58] transition-all order-1 sm:order-2">Talk to AI Designer →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Chat */}
                        {step === 3 && (
                            <div className="animate-in fade-in scale-in-95 duration-700 h-full flex flex-col">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-serif italic mb-2 text-[#1a1410]">Conversational Curator</h2>
                                    <p className="text-[10px] uppercase tracking-widest text-[#a17a58]">Designing for your {occasion}...</p>
                                </div>

                                <div className="flex-1 min-h-[400px] border border-gray-100 bg-[#fafafa]/50 rounded-lg p-6 overflow-y-auto mb-6 flex flex-col gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-100 max-w-[85%] self-start shadow-sm transition-all duration-500">
                                        <p className="text-sm font-light leading-relaxed text-gray-700">
                                            Namaste! I have your preferences. A {occasion} in Jaipur calls for something truly special. What specific mood or celebrity inspiration do you have in mind?
                                        </p>
                                    </div>

                                    {chatLog.map((m, i) => (
                                        <div key={i} className={`p-4 rounded-lg text-sm font-light leading-relaxed max-w-[85%] shadow-sm transition-all duration-500 ${m.role === 'user' ? 'bg-[#1a1410] text-white self-end' : 'bg-white border border-gray-100 text-gray-700 self-start'}`}>
                                            {m.content}
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="self-start bg-white p-4 rounded-lg border border-gray-100 animate-pulse flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[#a17a58] rounded-full animate-bounce" />
                                            <div className="w-1 h-1 bg-[#a17a58] rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1 h-1 bg-[#a17a58] rounded-full animate-bounce [animation-delay:0.4s]" />
                                            <span className="text-[10px] uppercase tracking-widest text-[#a17a58] ml-2 font-medium">Atelier is thinking...</span>
                                        </div>
                                    )}

                                    {looks.length > 0 && (
                                        <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
                                            <p className="text-center text-[10px] uppercase tracking-[4px] text-[#a17a58]">Selected Look Directions</p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {looks.map((look, i) => (
                                                    <div key={i} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-all group">
                                                        <h3 className="font-serif italic text-lg mb-2">{look.name}</h3>
                                                        <p className="text-xs text-gray-500 mb-4 font-light leading-relaxed truncate-2-lines">{look.direction}</p>
                                                        <div className="text-[10px] uppercase tracking-widest text-[#a17a58] border-t border-gray-50 pt-4 mb-4">
                                                            <div className="flex justify-between mb-1"><span>Fabric</span><span className="text-gray-400 font-light lowercase truncate max-w-[120px]">{look.fabric_notes}</span></div>
                                                            <div className="flex justify-between"><span>Accents</span><span className="text-gray-400 font-light lowercase truncate max-w-[120px]">{look.addons?.join(', ') || 'None'}</span></div>
                                                        </div>
                                                        <button onClick={() => generateConcept(look)} className="w-full bg-[#1a1410] text-white py-3 text-[10px] uppercase tracking-[2px] group-hover:bg-[#a17a58] transition-all">
                                                            Select & Visualize
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 border-gray-100 border bg-[#fafafa] rounded-sm px-6 py-4 text-sm font-light outline-none focus:border-[#a17a58] transition-all shadow-inner"
                                        placeholder="Discuss textures, themes, or colors..."
                                        value={msg}
                                        onChange={e => setMsg(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                                        disabled={loading}
                                    />
                                    <button onClick={handleChat} disabled={loading} className="bg-[#a17a58] text-white px-8 py-4 text-xs uppercase tracking-[2px] hover:bg-[#1a1410] transition-all shadow-md">
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Concept Image */}
                        {step === 4 && (
                            <div className="animate-in zoom-in-95 duration-1000 text-center">
                                <h2 className="text-2xl font-serif italic mb-2">{selectedLook?.name}</h2>
                                <p className="text-[10px] uppercase tracking-[4px] text-[#a17a58] mb-12">Generating Your Bespoke Concept...</p>

                                <div className="max-w-md mx-auto aspect-[3/4] bg-[#fafafa] border border-gray-100 rounded-sm relative overflow-hidden shadow-2xl mb-12 group">
                                    {imgLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                                            <div className="w-12 h-12 border-t-2 border-[#a17a58] rounded-full animate-spin" />
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[3px] text-[#a17a58] animate-pulse">Weaving details...</p>
                                                <p className="text-[8px] text-gray-400 mt-2 font-light italic">"{imagePrompt?.slice(0, 40)}..."</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={conceptImg || ''} className="w-full h-full object-cover transition-all duration-1000 animate-in fade-in zoom-in-110" />
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[8px] uppercase tracking-widest text-[#a17a58] border border-gray-100 shadow-sm">AI Render · Concept Only</div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button onClick={() => setStep(3)} className="text-[10px] uppercase tracking-[2px] text-gray-400 hover:text-[#a17a58] transition-all">← Different Direction</button>
                                    {!imgLoading && (
                                        <button onClick={() => setStep(5)} className="bg-[#1a1410] text-white px-12 py-4 text-xs uppercase tracking-[3px] hover:bg-[#a17a58] transition-all shadow-lg">
                                            Finalize & Bespoke Details →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Finalize */}
                        {step === 5 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h2 className="text-2xl font-serif italic mb-10 text-center">Bespoke Finishings</h2>

                                <div className="grid md:grid-cols-2 gap-16 mb-16">
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Lapel / Collar Style</label>
                                            <select className={inputClasses} value={lapel} onChange={e => setLapel(e.target.value)}>
                                                {['Peak Satin Lapel', 'Notch Wool Lapel', 'Shawl Velvet Lapel', 'Mandarin/Bandhgala Collar', 'Modern Nehru Collar'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Button Finish</label>
                                            <select className={inputClasses} value={buttons} onChange={e => setButtons(e.target.value)}>
                                                {['Fabric Covered', 'Gold Plated Brass', 'Silver Filigree', 'Antique Copper', 'Hidden Placket'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Embroidery Intensity</label>
                                            <select className={inputClasses} value={embroidery} onChange={e => setEmbroidery(e.target.value)}>
                                                {['None (Minimal)', 'Subtle (Collar/Cuffs)', 'Moderate (Chest Motif)', 'Heavy (Full Front)'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Lining Choice</label>
                                            <select className={inputClasses} value={lining} onChange={e => setLining(e.target.value)}>
                                                {['Printed Silk', 'Solid Satin', 'Matches Outer', 'Lightweight Cotton'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Monogram Initials (Optional)</label>
                                            <input className={inputClasses} placeholder="e.g. A.S." value={monogram} onChange={e => setMonogram(e.target.value)} maxLength={5} />
                                        </div>
                                        <div className="p-6 bg-[#fafafa] border border-gray-100 rounded-sm">
                                            <p className="text-[10px] uppercase tracking-widest text-[#a17a58] mb-4">Brief Ready</p>
                                            <p className="text-[11px] font-mono text-gray-500 line-clamp-3 italic">"{finalizeBrief().slice(0, 100)}..."</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        onClick={() => window.open(`https://wa.me/919063356542?text=${encodeURIComponent(finalizeBrief())}`, '_blank')}
                                        className="w-full max-w-md bg-[#25D366] text-white py-5 text-sm uppercase tracking-[4px] hover:scale-[1.02] transition-all shadow-xl font-bold rounded-sm flex items-center justify-center gap-3 group"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        Handover to Master Tailor
                                    </button>
                                    <button onClick={() => setStep(4)} className="text-[10px] uppercase tracking-[2px] text-gray-400 hover:text-[#a17a58] transition-all">← Back to Design</button>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-gray-400 text-[10px] uppercase tracking-[3px] leading-relaxed max-w-sm mx-auto">
                            Each Asuka piece is handcrafted over <span className="text-[#a17a58]">80+ hours</span> using heritage techniques and premium Italian fabrics.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
                .truncate-2-lines {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
}
