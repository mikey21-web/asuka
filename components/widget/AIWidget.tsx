'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import VoiceInput from '../ai/VoiceInput'
import { ASUKA_PRODUCTS } from '@/lib/groq'

/* ── TYPES ── */
type Tab = 'sizer' | 'style' | 'make'
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
    <div style={{ width: '100%', aspectRatio: '3/4', maxHeight: '280px', border: '1px solid #d4c4b0', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: summary ? bg : '#f5f0e8', transition: 'background 0.5s ease', borderRadius: '8px' }}>
      {imgUrl ? (
        <>
          <img
            src={imgUrl}
            alt="Design Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
            onLoad={() => setImgLoaded(true)}
          />
          {!imgLoaded && (
            <div className="animate-pulse" style={{ position: 'absolute', inset: 0, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: '#a17a58', letterSpacing: '2px' }}>WEAVING YOUR DESIGN…</span>
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
   SIZER PANEL
══════════════════════════ */
function SizerPanel() {
  const [step, setStep] = useState(1)
  const [pt, setPt] = useState('kurta')
  const [brand, setBrand] = useState('')
  const [size, setSize] = useState('')
  const [fit, setFit] = useState('Regular')
  const [shape, setShape] = useState('Athletic')
  const [issues, setIssues] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const ISSUES_LIST = ['Sleeves too long', 'Waist too tight', 'Tight on chest', 'Shoulder drops', 'Hip tight']
  const SHAPES = ['Athletic', 'Lean', 'Broad Chest', 'Belly', 'Broad Shoulders']

  async function run() {
    setLoading(true)
    try {
      const res = await fetch('/api/sizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'brand_size', brand, size, product_type: pt, fit_preference: fit, body_shape: shape, issues }),
      })
      const data = await res.json()
      setResult(data)
      setStep(3)
    } catch {
      setResult({ asuka_size: 'M', confidence: 0.84, reasoning: 'We recommend Asuka M based on your regular brand size.' })
      setStep(3)
    }
    setLoading(false)
  }

  const inputStyle = { width: '100%', background: '#fff', border: '1px solid #d4c4b0', color: '#1a1410', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300 as const, padding: '10px 13px', outline: 'none', marginBottom: '10px', borderRadius: '4px' }
  const selectStyle = { ...inputStyle, appearance: 'none' as const, cursor: 'pointer' }

  return (
    <div style={{ minHeight: '340px' }}>
      {/* Progress Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '3px', background: step >= s ? '#a17a58' : '#e8e0d6', borderRadius: '2px', transition: 'all 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fadeRight">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '12px' }}>Garment & Brand</div>
          <select style={selectStyle} value={pt} onChange={e => setPt(e.target.value)}>
            {['kurta', 'sherwani', 'bandhgala', 'suit', 'jacket', 'shirt'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <input style={inputStyle} value={brand} onChange={e => setBrand(e.target.value)} placeholder="Which brand do you wear? (e.g. Zara, H&M)" />
          <input style={inputStyle} value={size} onChange={e => setSize(e.target.value)} placeholder="Your size in that brand? (e.g. M, 40)" />
          <button type="button" onClick={() => setStep(2)} disabled={!brand || !size} style={{ width: '100%', padding: '13px', background: '#a17a58', color: '#fff', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: (!brand || !size) ? 'not-allowed' : 'pointer', opacity: (!brand || !size) ? 0.4 : 1, transition: 'all 0.2s', borderRadius: '4px', marginTop: '10px' }}>
            Next: Fit & Shape →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeRight">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '12px' }}>Fit Preference</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['Slim', 'Regular', 'Relaxed'].map(f => (
              <button type="button" key={f} onClick={() => setFit(f)} style={{ flex: 1, padding: '10px', border: fit === f ? '1px solid #a17a58' : '1px solid #d4c4b0', background: fit === f ? '#a17a58' : 'none', color: fit === f ? '#fff' : '#a17a58', fontFamily: 'var(--font-mono)', fontSize: '8px', cursor: 'pointer', borderRadius: '4px' }}>{f.toUpperCase()}</button>
            ))}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '12px' }}>Body Shape</div>
          <select style={selectStyle} value={shape} onChange={e => setShape(e.target.value)}>
            {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '10px' }}>Common Fit Issues</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {ISSUES_LIST.map(issue => (
              <label key={issue} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" checked={issues.includes(issue)} onChange={e => e.target.checked ? setIssues([...issues, issue]) : setIssues(issues.filter(i => i !== issue))} />
                {issue}
              </label>
            ))}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '10px' }}>Upload Photos (Optional)</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button type="button" onClick={() => alert('Photo upload simulation: In a real environment, this would open a camera/file picker to capture front/side profile.')} style={{ flex: 1, padding: '12px', border: '1px dashed #d4c4b0', background: '#fff', color: '#999', fontSize: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <span>Front View</span>
            </button>
            <button type="button" onClick={() => alert('Photo upload simulation')} style={{ flex: 1, padding: '12px', border: '1px dashed #d4c4b0', background: '#fff', color: '#999', fontSize: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <span>Side View</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: 0.5, padding: '13px', background: 'none', color: '#a17a58', border: '1px solid #d4c4b0', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Back</button>
            <button type="button" onClick={run} disabled={loading} style={{ flex: 1, padding: '13px', background: '#a17a58', color: '#fff', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '4px' }}>
              {loading ? 'Analyzing…' : 'Get Final Match →'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="animate-fadeUp">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2.5px', color: '#a17a58', textTransform: 'uppercase', marginBottom: '8px' }}>Your Best Match</div>
            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: '#1a1410' }}>{result.asuka_size}</div>
          </div>

          <div style={{ background: '#f5ede3', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d4c4b0' }}>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: result.reasoning || '' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: '#999', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Confidence Score</span>
            <div style={{ flex: 1, height: '4px', background: '#e8e0d6', borderRadius: '2px' }}>
              <div className="animate-fillBar" style={{ height: '100%', background: '#a17a58', borderRadius: '2px', width: `${Math.round((result.confidence || 0.88) * 100)}%` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#a17a58', fontWeight: 600 }}>{Math.round((result.confidence || 0.88) * 100)}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '13px', background: 'none', border: '1px solid #a17a58', color: '#a17a58', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Start Over</button>
            <button type="button" onClick={() => window.open(`https://wa.me/919063356542?text=${encodeURIComponent(`Namaste! My Fit Finder result is Asuka ${result.asuka_size}. I'd like to book a sizing chat for my ${pt}.`)}`, '_blank')} style={{ width: '100%', padding: '13px', background: '#a17a58', color: '#fff', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Book Sizing Chat (WhatsApp) →</button>
          </div>
        </div>
      )}
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
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `${persona}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
  const [summary, setSummary] = useState<string | null>(null)
  const [imgPrompt, setImgPrompt] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Initialize first assistant message
  useEffect(() => {
    if (msgs.length === 0) {
      const g = persona === 'style'
        ? `Namaste! ✨ I'm Ayaan, your personal stylist. What occasion can I help you with today?`
        : `Namaste! 👋 I'm your Asuka Atelier assistant. I can help you design a one-of-a-kind custom outfit. What vibe do you have in mind?`
      setMsgs([{ role: 'assistant', content: g }])
    }
  }, [persona, msgs.length])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])



  const send = useCallback(async (txt: string) => {
    if (!txt.trim() || loading) return
    const next: ChatMsg[] = [...msgs, { role: 'user', content: txt }]
    setMsgs(next); setInput(''); setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt, session_id: sessionId }),
      })
      const data = await res.json()
      if (data.design_summary) setSummary(data.design_summary)
      if (data.image_prompt) setImgPrompt(data.image_prompt)
      setMsgs(m => [...m, {
        role: 'assistant',
        content: data.reply || data.error || 'Please try again.',
        products: data.products_mentioned
      }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Maafi (Sorry), I had a momentary connection slip. Could you repeat that for me? 🙏' }])
    }
    setLoading(false); inputRef.current?.focus()
  }, [msgs, loading, endpoint, sessionId])

  const chatH = showPreview ? (summary ? 160 : 220) : (systemHeight || 300)

  const inputStyle = { width: '100%', background: '#fff', border: '1px solid #d4c4b0', color: '#1a1410', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300 as const, padding: '10px 13px', outline: 'none', marginBottom: '10px', borderRadius: '4px' }


  return (
    <>
      {showPreview && <GarmentPreview summary={summary} prompt={imgPrompt} />}
      {showPreview && summary && (
        <div style={{ marginBottom: '12px', padding: '10px 12px', background: '#f5ede3', border: '1px solid #d4c4b0', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#a17a58', textTransform: 'uppercase' }}>Design Preview</div>
            <button type="button" onClick={() => { /* Toggle Customize UI */ }} style={{ background: 'none', border: '1px solid #a17a58', color: '#a17a58', fontSize: '7px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }}>Customize ▿</button>
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#555', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{summary}</pre>
          <button type="button" onClick={() => window.open(`https://wa.me/919063356542?text=${encodeURIComponent("Salaam! My Asuka Atelier Design Brief is ready:\n\n" + summary)}`, '_blank')} style={{ marginTop: '8px', width: '100%', padding: '11px', background: '#a17a58', color: '#fff', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Finalize & Discuss (WhatsApp) →</button>
        </div>
      )}
      {/* Quick prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
        {quickPrompts.map(q => (
          <button type="button" key={q} onClick={() => send(q)} style={{ padding: '5px 10px', border: '1px solid #d4c4b0', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: '#a17a58', cursor: 'pointer', background: 'none', textTransform: 'uppercase', transition: 'all 0.2s', borderRadius: '3px' }} onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#a17a58'; (e.target as HTMLButtonElement).style.color = '#fff'; (e.target as HTMLButtonElement).style.background = '#a17a58'; }} onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#d4c4b0'; (e.target as HTMLButtonElement).style.color = '#a17a58'; (e.target as HTMLButtonElement).style.background = 'none'; }}>
            {q}
          </button>
        ))}
      </div>
      {/* Messages */}
      <div className="chat-scroll" style={{ height: `${chatH}px`, overflowY: 'auto', marginBottom: '10px' }}>
        {msgs.map((m, i) => (
          <div key={i} className="animate-fadeUp" style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: m.role === 'user' ? '#a17a58' : '#999', marginBottom: '4px' }}>{m.role === 'assistant' ? (persona === 'style' ? 'Ayaan · Asuka' : 'Asuka Atelier') : 'You'}</span>
            <div style={{ maxWidth: '85%', padding: '10px 14px', fontSize: '12px', lineHeight: 1.7, color: '#1a1410', background: m.role === 'user' ? '#f5ede3' : '#faf7f2', border: m.role === 'user' ? '1px solid #d4c4b0' : '1px solid #e8e0d6', borderRadius: '6px' }}>
              {m.content.split('\n').map((line, j) => (
                <span key={j}><Bold text={line} />{j < m.content.split('\n').length - 1 && <br />}</span>
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
        ))}
        {loading && (
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>{persona === 'style' ? 'Ayaan · Asuka' : 'Asuka Atelier'}</span>
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#999', background: '#faf7f2', border: '1px solid #e8e0d6', borderRadius: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #e8e0d6', borderTopColor: '#a17a58', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '7px', verticalAlign: 'middle' }} />
              {persona === 'style' ? 'Styling…' : 'Designing…'}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fff', padding: '12px', borderTop: '1px solid #e8e0d6' }}>
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
          <VoiceInput onTranscription={(txt) => send(txt)} isChatLoading={loading} />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1410', color: '#fff', border: 'none', borderRadius: '50%', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !input.trim()) ? 0.3 : 1, transition: 'all 0.2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════
   MAIN WIDGET
══════════════════════════ */
export default function AIWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('sizer')

  useEffect(() => {
    (window as any).openAsukaPanel = (t: Tab) => { setTab(t || 'sizer'); setOpen(true) }
    return () => { delete (window as any).openAsukaPanel }
  }, [])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sizer', label: 'AI Sizer' },
    { id: 'style', label: 'Style Me' },
    { id: 'make', label: 'Make It' },
  ]

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}>
      {/* Panel */}
      {open && (
        <div className="animate-panelOpen" style={{ position: 'fixed', bottom: '100px', right: '28px', width: '440px', maxHeight: '85vh', background: '#fdf9f5', border: '1px solid #d4c4b0', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 80px rgba(0,0,0,0.15)', zIndex: 9998, overflow: 'hidden', borderRadius: '12px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: '#f5ede3', borderBottom: '1px solid #d4c4b0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {tabs.map(t => (
                <button type="button" key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 14px', background: tab === t.id ? '#a17a58' : 'none', border: tab === t.id ? '1px solid #a17a58' : '1px solid #d4c4b0', color: tab === t.id ? '#fff' : '#a17a58', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '4px', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#1a1410')} onMouseLeave={e => (e.currentTarget.style.color = '#999')}>✕</button>
          </div>
          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px', minHeight: 0 }}>
            {tab === 'sizer' && <SizerPanel />}
            {tab === 'style' && (
              <ChatPanel
                endpoint="/api/stylist"
                persona="style"
                quickPrompts={['Wedding guest', 'Groom · sangeet', 'Office ethnic', 'Beach wedding', 'Eid look', 'Diwali party']}
                systemHeight={320}
              />
            )}
            {tab === 'make' && (
              <ChatPanel
                endpoint="/api/design"
                persona="design"
                quickPrompts={['Wedding groom', 'Sangeet night', 'Casual fusion', 'Festive kurta', 'Corporate look']}
                showPreview={true}
              />
            )}
          </div>
        </div>
      )}
      {/* FAB */}
      <div style={{ position: 'relative' }}>
        <button type="button" className="animate-fabPulse" onClick={() => setOpen(o => !o)} style={{ width: '60px', height: '60px', background: '#a17a58', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(143,101,77,0.4)' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 6.5-6 7.4V20l-2-2-2 2v-3.6C5.5 15.5 3 12.5 3 9a7 7 0 0 1 9-7z" /><circle cx="9" cy="9" r="1" fill="#fff" /><circle cx="12" cy="9" r="1" fill="#fff" /><circle cx="15" cy="9" r="1" fill="#fff" /></svg>
          )}
        </button>
        {/* Tooltip */}
        {!open && (
          <div style={{ position: 'absolute', right: '72px', bottom: '50%', transform: 'translateY(50%)', background: '#a17a58', border: 'none', padding: '8px 14px', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: '#fff', textTransform: 'uppercase', pointerEvents: 'none', borderRadius: '6px', boxShadow: '0 2px 10px rgba(143,101,77,0.3)' }}>
            AI Style Assistant
            <span style={{ position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid #a17a58' }} />
          </div>
        )}
      </div>
    </div>
  )
}
