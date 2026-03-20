'use client'

import { useState, useEffect, useRef } from 'react'
import { type CatalogProduct } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'
import Link from 'next/link'

const BRAND_COPPER = '#a17a58'
const BRAND_INK = '#1a1410'

interface Message {
    role: 'assistant' | 'user'
    text: string
    type?: 'product' | 'text'
    products?: CatalogProduct[]
}

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    text: "Namaste! ✨ I'm Ayaan, your personal stylist. What occasion are we planning for today?"
}

export default function AIStylist() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        WELCOME_MESSAGE
    ])
    const [inputValue, setInputValue] = useState('')
    const [isListening, setIsListening] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [messages])

    const [loading, setLoading] = useState(false)
    const [sessionId] = useState(() => `stylist_${Math.random().toString(36).slice(2, 9)}`)

    function resetChat() {
        setMessages([WELCOME_MESSAGE])
        setInputValue('')
    }

    async function handleSend() {
        if (!inputValue.trim() || loading) return
        const userText = inputValue.trim()
        setMessages(prev => [...prev, { role: 'user', text: userText }])
        setInputValue('')
        setLoading(true)

        try {
            const res = await fetch('/api/stylist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, session_id: sessionId })
            })
            const data = await res.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
            }
            if (data.products_mentioned && data.products_mentioned.length > 0) {
                setMessages(prev => [...prev, { role: 'assistant', text: '', type: 'product', products: data.products_mentioned }])
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', text: "Maafi (Sorry), I had a momentary connection slip. Tell me again?" }])
        }
        setLoading(false)
    }

    function startVoice() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
        type RecognitionCtor = new () => {
            lang: string
            interimResults: boolean
            onstart: (() => void) | null
            onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
            onerror: (() => void) | null
            onend: (() => void) | null
            start: () => void
        }
        const recognitionCtor =
            ((window as Window & { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition) ||
            ((window as Window & { SpeechRecognition?: RecognitionCtor }).SpeechRecognition)
        if (!recognitionCtor) return

        const recognition = new recognitionCtor()
        recognition.lang = 'en-IN'
        recognition.interimResults = false
        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            setInputValue(transcript)
            setIsListening(false)
        }
        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        recognition.start()
    }

    return (
        <>
            {/* Toggle */}
            {!isOpen && (
                <button type="button" onClick={() => setIsOpen(true)} className="animate-fabPulse"
                    style={{
                        position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%',
                        background: BRAND_INK, color: 'white', border: `2px solid ${BRAND_COPPER}`, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                    }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </button>
            )}

            {/* Chat */}
            {isOpen && (
                <div className="animate-panelOpen"
                    style={{
                        position: 'fixed', bottom: '30px', right: '30px', width: '400px', height: '600px',
                        background: '#fffdfd', zIndex: 10000, display: 'flex', flexDirection: 'column',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: `1px solid rgba(143,101,77,0.2)`
                    }}>

                    {/* Header */}
                    <div style={{ padding: '18px 20px', background: BRAND_INK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'white', margin: 0, letterSpacing: '2px' }}>AI STYLIST</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: BRAND_COPPER, margin: '4px 0 0', letterSpacing: '1px' }}>ASUKA COUTURE</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={resetChat}
                                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.35)', color: 'white', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', padding: '6px 10px', textTransform: 'uppercase' }}
                            >
                                Reset
                            </button>
                            <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' }}>×</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-scroll" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                                {m.type === 'product' && m.products ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {m.products.map(p => (
                                            <div key={p.id} style={{ background: 'white', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '8px' }}>
                                                <Link href={`/products/${p.handle}`} style={{ textDecoration: 'none', display: 'flex' }}>
                                                    <img src={p.first_image} alt={p.title} style={{ width: '100px', height: '140px', objectFit: 'cover', flexShrink: 0 }} />
                                                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: BRAND_INK, marginBottom: '2px', lineHeight: 1.3 }}>{p.title}</div>
                                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: BRAND_COPPER, marginBottom: '6px' }}>{formatPrice(p.price)}</div>

                                                        {/* The "Brainy" Part: Recommendation Reason */}
                                                        {(p as any).recommendation_reason && (
                                                            <div style={{
                                                                fontFamily: 'var(--font-sans)',
                                                                fontSize: '11px',
                                                                color: '#666',
                                                                lineHeight: 1.4,
                                                                background: '#f9f7f4',
                                                                padding: '6px 8px',
                                                                borderRadius: '4px',
                                                                borderLeft: `2px solid ${BRAND_COPPER}`,
                                                                marginBottom: '8px',
                                                                fontStyle: 'italic'
                                                            }}>
                                                                "{(p as any).recommendation_reason}"
                                                            </div>
                                                        )}

                                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: BRAND_INK, fontWeight: 700, marginTop: 'auto', letterSpacing: '1px' }}>VIEW MASTERPIECE →</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: '11px 15px', borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '2px 14px 14px 14px',
                                        background: m.role === 'user' ? BRAND_COPPER : '#f5f0e8',
                                        color: m.role === 'user' ? 'white' : BRAND_INK,
                                        fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.6,
                                    }}>
                                        {m.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '14px', borderTop: '1px solid #eee', background: 'white' }}>
                        <form onSubmit={e => { e.preventDefault(); handleSend() }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f6f3', padding: '10px 14px', borderRadius: '50px', border: '1px solid #e0d5c8' }}>
                            <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                                placeholder="Describe your style..."
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '13px', color: BRAND_INK }} />
                            <button type="button" onClick={startVoice}
                                className={isListening ? 'voice-mic-btn listening' : 'voice-mic-btn'}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: isListening ? '#c0392b' : BRAND_COPPER, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                            </button>
                            <button type="submit"
                                style={{ background: BRAND_INK, border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
