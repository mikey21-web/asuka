'use client'

import { useState, useRef, useEffect } from 'react'
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
    const [time, setTime] = useState('Evening')
    const [vibe, setVibe] = useState(50) // 0: Classic/Minimal, 100: Bold/Embellished
    const [colors, setColors] = useState('Navy, Emerald, Black')
    const [avoidColors, setAvoidColors] = useState('Red, Orange')
    const [budget, setBudget] = useState('₹40k - ₹80k')

    // Step 2: Personal Inputs
    const [hw, setHw] = useState('')
    const [skin, setSkin] = useState('Medium')
    const [fit, setFit] = useState('Slim')
    const [ownedItems, setOwnedItems] = useState('Black patent leather shoes')

    // Step 3: Chat & AI Looks
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [looks, setLooks] = useState<Look[]>([])
    const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([])

    // Step 4: Concept Img & Customize
    const [selectedLook, setSelectedLook] = useState<Look | null>(null)
    const [lapel, setLapel] = useState('Peak Satin Lapel')
    const [buttons, setButtons] = useState('Fabric Covered')
    const [embroidery, setEmbroidery] = useState('Subtle Threadwork on Collar')
    const [lining, setLining] = useState('Printed Silk')
    const [monogram, setMonogram] = useState('')
    const [imgLoaded, setImgLoaded] = useState(false)

    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatLog, loading, looks])

    const handleFetchLooks = async () => {
        if (!msg.trim()) return
        setLoading(true)
        const currentMsg = { role: 'user', content: msg }
        setChatLog(prev => [...prev, currentMsg])
        setMsg('')

        const payload = {
            inputs: { occasion, location, time, vibe, colors, avoidColors, budget, hw, skin, fit, ownedItems },
            message: msg,
            history: chatLog
        }

        try {
            const res = await fetch('/api/miy-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            setChatLog(prev => [...prev, { role: 'assistant', content: data.message || "I've curated some designs." }])
            if (data.looks?.length > 0) setLooks(data.looks)
        } catch (err) {
            setChatLog(prev => [...prev, { role: 'assistant', content: "My apologies, I couldn't reach the atelier." }])
        }
        setLoading(false)
    }

    const InputStyle = {
        width: '100%', padding: '14px', border: '1px solid #ddd', outline: 'none',
        fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '16px', background: '#fafafa', borderRadius: '4px'
    }
    const LabelStyle = { display: 'block', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' as const, color: BRAND_COPPER, marginBottom: '8px', fontWeight: 500 }

    const finalizeBriefString = () => {
        return `Namaste! My Make-It-Yourself Design Brief:

**OCCASION & VIBE**
- Occasion: ${occasion} (${location}, ${time})
- Vibe: ${vibe < 40 ? 'Classic/Minimal' : vibe > 60 ? 'Bold/Embellished' : 'Balanced'}
- Preffered Colors: ${colors} (Avoid: ${avoidColors})
- Budget Limit: ${budget}

**PERSONAL INPUTS**
- Fit: ${fit} | Skin: ${skin} | H/W: ${hw}
- Owning: ${ownedItems}

**CHOSEN LOOK**: ${selectedLook?.name}
- Direction: ${selectedLook?.direction}
- Fabric: ${selectedLook?.fabric_notes}

**CUSTOMIZATIONS**
- Lapel: ${lapel} | Buttons: ${buttons}
- Embroidery: ${embroidery}
- Lining: ${lining}
- Monogram: ${monogram || 'None'}

Please connect me with a Master Tailor to finalize sizing and production.`
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: BG_CREAM, paddingTop: '100px', paddingBottom: '100px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', border: `1px solid ${BRAND_COPPER}`, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
                    {/* Header */}
                    <div style={{ padding: '40px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 300, color: BRAND_INK, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>Make It Yourself</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} style={{ width: '30px', height: '3px', background: step >= s ? BRAND_COPPER : '#eee', transition: 'all 0.3s' }} />
                            ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', marginTop: '16px' }}>Step {step} of 5</p>
                    </div>

                    <div style={{ padding: '40px' }}>
                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="animate-fadeUp">
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 400, marginBottom: '24px', color: BRAND_INK }}>The Occasion & Vibe</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={LabelStyle}>Occasion</label>
                                        <select style={InputStyle} value={occasion} onChange={e => setOccasion(e.target.value)}>
                                            {['Wedding Guest', 'Groom', 'Cocktail', 'Reception', 'Engagement', 'Corporate', 'Festive'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={LabelStyle}>Budget Range</label>
                                        <select style={InputStyle} value={budget} onChange={e => setBudget(e.target.value)}>
                                            {['₹25k - ₹40k', '₹40k - ₹80k', '₹80k - ₹1.5L', '₹1.5L+'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={LabelStyle}>Location / Weather</label>
                                        <select style={InputStyle} value={location} onChange={e => setLocation(e.target.value)}>
                                            {['Indoor (AC)', 'Outdoor (Summer)', 'Outdoor (Winter)', 'Destination (Beach)'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={LabelStyle}>Time of Day</label>
                                        <select style={InputStyle} value={time} onChange={e => setTime(e.target.value)}>
                                            {['Morning', 'Afternoon', 'Evening', 'Late Night'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: BRAND_COPPER, marginBottom: '8px', fontWeight: 500 }}>
                                        <span>Classic & Minimal</span>
                                        <span>Vibe</span>
                                        <span>Bold & Embellished</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={vibe} onChange={e => setVibe(Number(e.target.value))} style={{ width: '100%', accentColor: BRAND_COPPER }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={LabelStyle}>Preferred Colors</label>
                                        <input style={InputStyle} value={colors} onChange={e => setColors(e.target.value)} placeholder="e.g. Ivory, Navy, Sage Green" />
                                    </div>
                                    <div>
                                        <label style={LabelStyle}>Colors to Avoid</label>
                                        <input style={InputStyle} value={avoidColors} onChange={e => setAvoidColors(e.target.value)} placeholder="e.g. Yellow, Bright Red" />
                                    </div>
                                </div>

                                <button type="button" onClick={() => setStep(2)} style={{ width: '100%', padding: '16px', background: BRAND_INK, color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', border: 'none', marginTop: '20px', cursor: 'pointer', zIndex: 10, position: 'relative' }}>Next: Personal Inputs →</button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="animate-fadeUp">
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 400, marginBottom: '24px', color: BRAND_INK }}>Personal Attributes</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={LabelStyle}>Height / Weight (Optional)</label>
                                        <input style={InputStyle} value={hw} onChange={e => setHw(e.target.value)} placeholder="e.g. 5'11 / 78kg" />
                                    </div>
                                    <div>
                                        <label style={LabelStyle}>Skin Tone</label>
                                        <select style={InputStyle} value={skin} onChange={e => setSkin(e.target.value)}>
                                            {['Fair/Light', 'Medium/Wheatish', 'Olive/Tan', 'Deep/Dark'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={LabelStyle}>Fit Preference</label>
                                        <select style={InputStyle} value={fit} onChange={e => setFit(e.target.value)}>
                                            {['Extra Slim', 'Slim Tailored', 'Classic/Regular', 'Relaxed'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={LabelStyle}>Existing Items to Match</label>
                                        <input style={InputStyle} value={ownedItems} onChange={e => setOwnedItems(e.target.value)} placeholder="e.g. Gold Watch, Tan Loafers" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', background: 'transparent', color: BRAND_COPPER, border: `1px solid ${BRAND_COPPER}`, fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', zIndex: 10, position: 'relative' }}>← Back</button>
                                    <button type="button" onClick={() => setStep(3)} style={{ flex: 2, padding: '16px', background: BRAND_INK, color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}>Talk to AI Designer →</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="animate-fadeUp">
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 400, marginBottom: '24px', color: BRAND_INK }}>Atelier Chat</h3>

                                <div style={{ border: '1px solid #eee', background: '#fafafa', borderRadius: '8px', padding: '24px', height: '400px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px 16px 16px 16px' }}>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, color: BRAND_INK, margin: 0 }}>
                                            Namaste! Based on your occasion ({occasion}) and budget ({budget}), I have a strong foundation for your design. What direction are you leaning towards?
                                            <br /><br /><span style={{ color: '#888' }}>e.g. "I want something dark, sexy, starlit vibe but not too loud."</span>
                                        </p>
                                    </div>

                                    {chatLog.map((m, i) => (
                                        <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', padding: '16px', background: m.role === 'user' ? BRAND_INK : 'white', color: m.role === 'user' ? 'white' : BRAND_INK, border: m.role === 'user' ? 'none' : '1px solid #ddd', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px' }}>
                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{m.content}</p>
                                        </div>
                                    ))}

                                    {loading && (
                                        <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px 16px 16px 16px' }}>
                                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', letterSpacing: '1px' }}>CURATING LOOKS...</span>
                                        </div>
                                    )}

                                    {looks.length > 0 && (
                                        <div style={{ alignSelf: 'center', width: '100%', marginTop: '20px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', letterSpacing: '2px', color: BRAND_COPPER, textTransform: 'uppercase', textAlign: 'center', marginBottom: '16px' }}>Suggested Directions</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                {looks.map((look, i) => (
                                                    <div key={i} style={{ padding: '16px', border: `1px solid ${BRAND_COPPER}`, background: '#fcfaf5', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                                        <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: BRAND_INK, margin: '0 0 8px 0', lineHeight: 1.4 }}>Look {i + 1}: {look.name}</h5>
                                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#666', marginBottom: '12px', lineHeight: 1.5 }}>{look.direction}</p>
                                                        <div style={{ borderTop: '1px solid #eaddd3', paddingTop: '10px' }}>
                                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: BRAND_COPPER, marginBottom: '6px' }}><strong>Fabric:</strong> {look.fabric_notes}</p>
                                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: BRAND_COPPER, margin: 0 }}><strong>Add-ons:</strong> {look.addons.join(' + ')}</p>
                                                        </div>
                                                        <button type="button" onClick={() => { setSelectedLook(look); setStep(4); }} style={{ width: '100%', padding: '10px', background: BRAND_INK, color: 'white', fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', border: 'none', marginTop: '16px', cursor: 'pointer' }}>Select & Customize →</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div ref={chatEndRef} />
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input style={{ ...InputStyle, marginBottom: 0 }} value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleFetchLooks()} placeholder="Type your vision here..." disabled={loading} />
                                    <button type="button" onClick={handleFetchLooks} disabled={loading} style={{ padding: '0 24px', background: BRAND_COPPER, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Send</button>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#999', fontFamily: 'var(--font-sans)', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '1px' }}>← Adjust Inputs</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4 */}
                        {step === 4 && selectedLook && (
                            <div className="animate-fadeUp">
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 400, marginBottom: '8px', color: BRAND_INK }}>{selectedLook.name}</h3>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#666', marginBottom: '30px' }}>Customize your bespoke details below to build the final brief.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
                                    {/* Image Generation Container */}
                                    <div>
                                        <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', border: '1px solid #ddd', position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={selectedLook.image_url}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                                                onLoad={() => setImgLoaded(true)}
                                                onError={(e) => {
                                                    // Fallback to a sophisticated placeholder if the AI hallucinates a URL
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop';
                                                }}
                                            />
                                            {!imgLoaded && (
                                                <div className="animate-pulse" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                                                    <span style={{ fontSize: '24px', opacity: 0.5, marginBottom: '10px' }}>✦</span>
                                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '2px', color: BRAND_COPPER }}>PULLING FROM CATALOG...</span>
                                                </div>
                                            )}

                                            {/* Transparent overlay denoting it's a render */}
                                            <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '6px 12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: BRAND_INK, textTransform: 'uppercase', border: '1px solid rgba(0,0,0,0.1)' }}>
                                                Base Inspiration / Real Product
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customization Options */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={LabelStyle}>Lapel Style</label>
                                            <select style={InputStyle} value={lapel} onChange={e => setLapel(e.target.value)}>
                                                {['Peak Satin Lapel', 'Notch Wool Lapel', 'Shawl Velvet Lapel', 'Mandarin/Bandhgala Collar'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={LabelStyle}>Button Stance</label>
                                            <select style={InputStyle} value={buttons} onChange={e => setButtons(e.target.value)}>
                                                {['Fabric Covered Buttons', 'Gold / Brass Embellished', 'Minimal Hidden Placket', 'Double Breasted'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={LabelStyle}>Embroidery Intensity</label>
                                            <select style={InputStyle} value={embroidery} onChange={e => setEmbroidery(e.target.value)}>
                                                {['None (Clean & Classic)', 'Subtle Threadwork on Collar/Cuffs', 'Medium Zardozi Motifs', 'Heavy All-over Embellishment'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={LabelStyle}>Lining Choice</label>
                                            <select style={InputStyle} value={lining} onChange={e => setLining(e.target.value)}>
                                                {['Solid Contrast Silk', 'Printed Floral Silk', 'Matches Outer Fabric', 'Breathable Cotton Blend'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={LabelStyle}>Monogram / Initials (Optional)</label>
                                            <input style={{ ...InputStyle, marginBottom: 0 }} value={monogram} onChange={e => setMonogram(e.target.value)} placeholder="e.g. A.R (Inside Collar)" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
                                    <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: '16px', background: 'transparent', color: BRAND_COPPER, border: `1px solid ${BRAND_COPPER}`, fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>← Change Look</button>
                                    <button type="button" onClick={() => setStep(5)} style={{ flex: 2, padding: '16px', background: BRAND_INK, color: 'white', fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Next: Human Handover →</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 5 */}
                        {step === 5 && (
                            <div className="animate-fadeUp" style={{ textAlign: 'center', padding: '20px 0' }}>
                                <span style={{ fontSize: '40px', display: 'block', marginBottom: '20px' }}>✦</span>
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 300, marginBottom: '16px', color: BRAND_INK }}>Your Brief is Ready</h3>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#666', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 40px auto' }}>
                                    We've assembled your design brief, concept image, and bespoke measurements. It's time to speak with a master tailor to confirm fabrics, finalize pricing, and begin production.
                                </p>

                                <div style={{ background: '#fafafa', border: '1px solid #eee', padding: '24px', textAlign: 'left', fontFamily: 'Courier New', fontSize: '12px', color: '#555', lineHeight: 1.6, marginBottom: '40px', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                                    {finalizeBriefString()}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                                    <button type="button" onClick={() => window.open(`https://wa.me/919063356542?text=${encodeURIComponent(finalizeBriefString())}`, '_blank')}
                                        style={{ width: '100%', maxWidth: '400px', padding: '18px', background: '#25D366', color: 'white', fontFamily: 'var(--font-sans)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, boxShadow: '0 8px 16px rgba(37,211,102,0.2)' }}>
                                        Start WhatsApp Handover
                                    </button>
                                    <button type="button" onClick={() => setStep(4)} style={{ background: 'none', border: 'none', color: '#999', fontFamily: 'var(--font-sans)', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '1px', marginTop: '10px' }}>← Edit Customizations</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
