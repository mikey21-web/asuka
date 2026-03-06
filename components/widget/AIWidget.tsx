'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import VoiceInput from '../ai/VoiceInput'
import { ASUKA_PRODUCTS } from '@/lib/groq'

/* ── TYPES ── */
type Tab = 'style'
type ChatMsg = { role: 'user' | 'assistant'; content: string; products?: string[] }
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/* ── COLOUR MAP FOR MIY PREVIEW ── */
const COLOURS: Record<string, string> = {
  ivory: '#F8F3E6', cream: '#F5F0DC', white: '#F5F5F2', navy: '#1B2A4A',
  midnight: '#0F1B2A', black: '#181818', indigo: '#2E3F7F', blue: '#2B5EA7',
  saffron: '#C97D10', orange: '#C4641A', amber: '#B8780C', emerald: '#1A6040',
  green: '#2D7A4F', sage: '#6B8C6B', burgundy: '#6B1A2A', maroon: '#7A1C1C',
  red: '#8B2020', rose: '#C47A8A', blush: '#E8A8B0', champagne: '#D8C890',
  gold: '#B8943C', grey: '#48485A', charcoal: '#28283A',
}
function extractColour(txt: string): string {
  const s = (txt || '').toLowerCase()
  for (const [k, v] of Object.entries(COLOURS)) if (s.includes(k)) return v
  return '#1A1410'
}

/* ── BOLD + PRODUCT LINK RENDERER ── */
function Bold({ text }: { text: string }) {
  // Match **text** and **[text]** patterns
  const parts = text.split(/(\*\*\[?.*?\]?\*\*)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          const inner = p.slice(2, -2).replace(/^\[|\]$/g, '') // strip ** and optional []
          // Try to find a matching product
          const product = ASUKA_PRODUCTS.find(prod =>
            prod.name.toLowerCase().includes(inner.toLowerCase()) ||
            inner.toLowerCase().includes(prod.name.toLowerCase())
          )
          if (product) {
            return (
              <a key={i} href={`/products/${product.url.split('/products/')[1] || ''}`}
                style={{ color: '#c9a84c', textDecoration: 'underline', fontWeight: 400, cursor: 'pointer' }}
                target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            )
          }
          return <strong key={i} style={{ color: 'var(--gold)', fontWeight: 400 }}>{inner}</strong>
        }
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

/* ── SVG GARMENT PREVIEW ── */
function GarmentPreview({ summary, prompt }: { summary: string | null, prompt?: string | null }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const bg = extractColour(summary || '')

  const genPrompt = prompt || (summary ? `luxury Indian menswear, ${summary}, editorial fashion photography, white background, cinematic lighting, 8k` : null)
  const imgUrl = genPrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(genPrompt)}?width=600&height=800&nologo=true&seed=${summary?.length || 42}` : null

  return (
    <div style={{ width: '100%', aspectRatio: '2/3', maxHeight: '280px', border: '1px solid var(--gold-border)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: summary ? bg : 'var(--paper)', transition: 'background 0.5s ease', borderRadius: '8px' }}>
      {imgUrl ? (
        <>
          <img
            src={imgUrl}
            alt="AI Perspective"
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
          {!imgLoaded && (
            <div className="animate-pulse" style={{ position: 'absolute', inset: 0, background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--gold)', letterSpacing: '2px' }}>WEAVING YOUR DESIGN…</span>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '28px', opacity: 0.3, display: 'block', marginBottom: '8px' }}>✦</span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1.5px', color: '#999', textTransform: 'uppercase', lineHeight: 1.8 }}>Your design<br />preview appears here</p>
        </div>
      )}
    </div>
  )
}

/* ── PRODUCT CARD component ── */
function ProductCard({ p: productObj, name }: { p?: any; name?: string }) {
  const p = productObj || ASUKA_PRODUCTS.find(x => x.name.toLowerCase() === (name || '').toLowerCase())
  if (!p) return null

  // Groq API returns {title, handle, price, image_url}
  // ASUKA_PRODUCTS returns {name, url, price, img}
  const title = p.title || p.name
  const price = p.price
  const imgUrl = p.image_url || p.img || ''
  const prodUrl = p.handle ? `/products/${p.handle}` : p.url

  return (
    <div className="animate-fadeUp" style={{ marginTop: '10px', background: '#faf7f2', border: '1px solid #d4c4b0', overflow: 'hidden', display: 'flex', borderRadius: '6px' }}>
      {imgUrl && (
        <div style={{ width: '80px', height: '100px', flexShrink: 0, borderRight: '1px solid #e8e0d6' }}>
          <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: '#1a1410', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#a17a58', letterSpacing: '1px', marginBottom: '8px' }}>
          {typeof price === 'string' && price.startsWith('Rs') ? price : `₹${Number(price).toLocaleString('en-IN')}`}
        </div>
        <a href={prodUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1.5px', color: '#fff', background: '#a17a58', padding: '5px 10px', textDecoration: 'none', textAlign: 'center', width: 'fit-content', borderRadius: '3px' }}>
          VIEW PRODUCT →
        </a>
      </div>
    </div>
  )
}

/* ══════════════════════════
   CHAT PANEL (shared)
══════════════════════════ */
function ChatPanel({ endpoint, persona, quickPrompts, systemHeight, showPreview = false }: {
  endpoint: string; persona: string; quickPrompts: string[]
  systemHeight?: number; showPreview?: boolean
}) {
  const storageKey = `asuka_chat_${persona}`
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `${persona}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
  const [summary, setSummary] = useState<string | null>(null)
  const [imgPrompt, setImgPrompt] = useState<string | null>(null)
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Save to localStorage whenever msgs change
  useEffect(() => {
    if (msgs.length > 0) {
      try { localStorage.setItem(storageKey, JSON.stringify(msgs.slice(-20))) } catch { }
    }
  }, [msgs, storageKey])

  // Initialize first assistant message
  useEffect(() => {
    if (msgs.length === 0) {
      const g = persona === 'style'
        ? "Namaste! I'm Ayaan, your personal stylist. What occasion can I help you with today?"
        : "Namaste! I'm your Asuka Atelier assistant. I can help you design a one-of-a-kind custom outfit. What vibe do you have in mind?"
      setMsgs([{ role: 'assistant', content: g }])
    }
  }, [persona, msgs.length])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading, streamingText])

  // Typewriter effect helper
  const typeWriter = useCallback((text: string, products?: any[]) => {
    const words = text.split(' ')
    let i = 0
    setStreamingText('')
    const timer = setInterval(() => {
      i++
      setStreamingText(words.slice(0, i).join(' '))
      if (i >= words.length) {
        clearInterval(timer)
        setStreamingText(null)
        setMsgs(m => [...m, { role: 'assistant', content: text, products }])
        setLoading(false)
        inputRef.current?.focus()
      }
    }, 20) // 20ms per word = snappier feel
    return timer
  }, [])

  const send = useCallback(async (txt: string) => {
    if (!txt.trim() || loading) return
    const next: ChatMsg[] = [...msgs, { role: 'user', content: txt }]
    setMsgs(next); setInput(''); setLoading(true)
    try {
      // Build chat history for API (last 10 turns for context)
      const history = next.slice(-10).map(m => ({ role: m.role, content: m.content }))
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt, session_id: sessionId, history }),
      })
      const data = await res.json()
      if (data.design_summary) setSummary(data.design_summary)
      if (data.image_prompt) setImgPrompt(data.image_prompt)
      // Handle MIY looks format vs stylist format
      const reply = data.reply || data.message || data.error || 'Please try again.'
      const products = data.products_mentioned || (data.looks ? data.looks.map((l: any) => ({
        title: l.name, image_url: l.image_url, price: l.fabric_notes
      })) : undefined)
      // Use typewriter effect for the response
      typeWriter(reply, products)
    } catch {
      // Graceful fallback - never show errors to user
      const fallbacks = [
        'I appreciate your patience! Let me think about that. In the meantime, feel free to browse our collections or try a different question.',
        'Thank you for waiting! I had a brief moment — could you share that again? I want to give you the best recommendation.',
        'My apologies for the delay. While I reconnect, you might enjoy browsing our bestsellers at /collections/celebrity-styles'
      ]
      typeWriter(fallbacks[Math.floor(Math.random() * fallbacks.length)])
    }
  }, [msgs, loading, endpoint, sessionId, typeWriter])

  const chatH = showPreview ? (summary ? 160 : 220) : (systemHeight || 300)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showPreview && <div style={{ padding: '15px 15px 0' }}><GarmentPreview summary={summary} prompt={imgPrompt} /></div>}
      {showPreview && summary && (
        <div style={{ flexShrink: 0, padding: '10px 12px', background: '#f5ede3', border: '1px solid #d4c4b0', borderRadius: '6px', margin: '0 15px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#a17a58', textTransform: 'uppercase' }}>Design Preview</div>
            <button type="button" onClick={() => { /* Toggle Customize UI */ }} style={{ background: 'none', border: '1px solid #a17a58', color: '#a17a58', fontSize: '7px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}>Customize ▿</button>
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#555', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{summary}</pre>
          <button type="button" onClick={() => window.open(`https://wa.me/919063356542?text=${encodeURIComponent("Salaam! My Asuka Atelier Design Brief is ready:\n\n" + summary)}`, '_blank')} style={{ marginTop: '8px', width: '100%', padding: '11px', background: '#a17a58', color: '#fff', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Finalize & Discuss (WhatsApp) →</button>
        </div>
      )}
      {/* Quick prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexShrink: 0, padding: '10px 15px' }}>
        {quickPrompts.map(q => (
          <button type="button" key={q} onClick={() => send(q)} style={{ padding: '5px 10px', border: '1px solid #d4c4b0', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: '#a17a58', cursor: 'pointer', background: 'none', textTransform: 'uppercase', transition: 'all 0.2s', borderRadius: '3px' }} onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#a17a58'; (e.target as HTMLButtonElement).style.color = '#fff'; (e.target as HTMLButtonElement).style.background = '#a17a58'; }} onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#d4c4b0'; (e.target as HTMLButtonElement).style.color = '#a17a58'; (e.target as HTMLButtonElement).style.background = 'none'; }}>
            {q}
          </button>
        ))}
      </div>
      {/* Messages */}
      <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '15px', WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
        {msgs.map((m, i) => {
          const cleanContent = m.content.replace(/[✨👋✦]/g, '').trim()
          return (
            <div key={i} className="animate-fadeUp" style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: m.role === 'user' ? '#a17a58' : '#999', marginBottom: '4px' }}>{m.role === 'assistant' ? (persona === 'style' ? 'Ayaan · Asuka' : 'Asuka Atelier') : 'You'}</span>
              <div style={{ maxWidth: '85%', padding: '10px 14px', fontSize: '12px', lineHeight: 1.7, color: '#1a1410', background: m.role === 'user' ? '#f5ede3' : '#faf7f2', border: m.role === 'user' ? '1px solid #d4c4b0' : '1px solid #e8e0d6', borderRadius: '6px' }}>
                {cleanContent.split('\n').map((line, j) => (
                  <span key={j}><Bold text={line} />{j < cleanContent.split('\n').length - 1 && <br />}</span>
                ))}

                {/* Render Product Cards if any */}
                {m.products && m.products.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {m.products.map((p, idx) => (
                      <ProductCard key={idx} p={typeof p === 'object' ? p : undefined} name={typeof p === 'string' ? p : undefined} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {loading && !streamingText && (
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>{persona === 'style' ? 'Ayaan · Asuka' : 'Asuka Atelier'}</span>
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#999', background: '#faf7f2', border: '1px solid #e8e0d6', borderRadius: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #e8e0d6', borderTopColor: '#a17a58', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '7px', verticalAlign: 'middle' }} />
              {persona === 'style' ? 'Styling…' : 'Designing…'}
            </div>
          </div>
        )}
        {/* Streaming typewriter bubble */}
        {streamingText !== null && (
          <div className="animate-fadeUp" style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>{persona === 'style' ? 'Ayaan · Asuka' : 'Asuka Atelier'}</span>
            <div style={{ maxWidth: '85%', padding: '10px 14px', fontSize: '12px', lineHeight: 1.7, color: '#1a1410', background: '#faf7f2', border: '1px solid #e8e0d6', borderRadius: '6px' }}>
              {streamingText}<span style={{ display: 'inline-block', width: '2px', height: '14px', background: '#a17a58', marginLeft: '2px', verticalAlign: 'middle', animation: 'pulse 0.8s ease-in-out infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input area - anchored to absolute bottom */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fff', padding: '12px 15px', borderTop: '1px solid #e8e0d6', flexShrink: 0, width: '100%', marginBottom: '-1px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder={persona === 'style' ? 'Describe your occasion or vibe…' : 'Describe your custom design…'}
          disabled={loading}
          style={{ flex: 1, background: 'none', border: 'none', color: '#1a1410', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 300, padding: '4px 0', outline: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <VoiceInput onTranscription={send} isChatLoading={loading} />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1410', color: '#fff', border: 'none', borderRadius: '50%', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !input.trim()) ? 0.3 : 1, transition: 'all 0.2s' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}


/* ══════════════════════════
   MAIN WIDGET
══════════════════════════ */
/* ── ICONS ── */
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
)
const X = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)
const Send = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
)
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)
const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
)
const Ruler = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3l-5-5L3.7 22.9l5 5L21.3 15.3z" /><path d="M7.5 19l2-2" /><path d="M10.5 16l2-2" /><path d="M13.5 13l2-2" /><path d="M5.5 17.5l-2-2" /></svg>
)
const Scissors = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88" /><path d="M14.47 14.48L20 20" /><path d="M8.12 8.12L12 12" /></svg>
)

/* ── MAIN WIDGET ══════════════════════════ */
export default function AIWidget({ isFloating = false }: { isFloating?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isFloating) return
    const handler = (e: any) => {
      setOpen(true)
    }
    window.addEventListener('openAsukaPanel', handler)
    return () => window.removeEventListener('openAsukaPanel', handler)
  }, [isFloating])

  if (pathname === '/make-it-yourself') {
    return null;
  }

  /* State for the Stylist Chat */
  const [chatKey, setChatKey] = useState(0)

  const handleStartOver = () => {
    localStorage.removeItem('asuka_chat_style')
    setChatKey(prev => prev + 1)
  }

  const widgetContent = (
    <div className={`w-full flex flex-col bg-[var(--paper)] overflow-hidden ${isFloating ? 'h-full sm:rounded-2xl' : 'border border-[var(--gold-border)] shadow-sm rounded-xl min-h-[500px]'}`}>
      <div className="flex flex-col bg-[var(--paper2)] border-b border-[var(--gold-border)] flex-shrink-0">
        <div className="flex items-center justify-between px-4 h-[50px] sm:h-[60px]">
          <button
            onClick={handleStartOver}
            className="flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-[var(--gold)] hover:opacity-70 transition-opacity"
            title="Clear Chat"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Start Over</span>
          </button>
          <span className="text-[10px] font-mono tracking-[3px] uppercase text-[var(--gold)] font-bold">
            AI Personal Stylist
          </span>
          <div className="w-8" /> {/* spacer */}
          {isFloating && (
            <button onClick={() => setOpen(false)} className="p-2 text-[var(--gold)] hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative" style={{ minHeight: 0 }}>
        <ChatPanel
          key={chatKey}
          endpoint="/api/stylist"
          persona="style"
          showPreview={false}
          quickPrompts={['Wedding guest', 'Groom · sangeet', 'Office ethnic', 'Beach wedding', 'Eid look', 'Diwali party']}
          systemHeight={isFloating ? 500 : 600}
        />
      </div>
    </div>
  )

  if (!isFloating) return widgetContent

  return (
    <>
      {/* Floating Action Button Stack */}
      {!open && (
        <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-7 z-[9998] flex flex-col gap-3 items-end">




          {/* 2. AI ATELIER (Link to MIY) */}
          <Link
            href="/make-it-yourself"
            className="bg-white/90 backdrop-blur-xl text-[#1a1410] w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] ring-1 ring-black/5 hover:scale-110 transition-all group relative border border-[var(--gold-border)]"
          >
            <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]" />
            <span className="absolute right-full mr-3 bg-[#1a1410] text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest font-mono pointer-events-none">AI ATELIER</span>
          </Link>

          {/* 3. AI ASSISTANT (Opens the panel) */}
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            aria-label="Open AI Assistant"
          >
            <div className="bg-white px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.1)] text-[#1a1410] font-sans font-medium text-[12px] sm:text-[13px] flex items-center gap-1 sm:gap-2 border border-[var(--gold-border)]">
              Chat with us <span className="text-sm sm:text-lg">👋</span>
            </div>
            <div className="relative w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[var(--gold)] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(145,108,76,0.4)] ring-1 ring-white/20">
              <Sparkles className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] bg-white text-[var(--gold)] text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--gold)]">
                1
              </div>
            </div>
          </button>
        </div>
      )}

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998] sm:hidden animate-fadeIn" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-7 sm:bottom-24 z-[9999] w-full sm:w-[350px] h-[85vh] sm:h-[560px] max-h-[85vh] flex flex-col animate-panelOpen shadow-[0_-10px_40px_rgba(0,0,0,0.15)] sm:shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden border border-[#e0d5c8] bg-white sm:mt-0">
            {widgetContent}
          </div>
        </>
      )}
    </>
  )
}
