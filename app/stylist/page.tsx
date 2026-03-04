'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import VoiceInput from '@/components/ai/VoiceInput'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ── DARK THEME ── */
const T = {
  bg: 'var(--ink)', bgAlt: 'var(--ink2)', bgAccent: 'var(--gold-dim)',
  text: 'var(--paper)', textMuted: 'var(--stone)', accent: 'var(--gold)', accentHover: 'var(--gold-light)',
  border: 'var(--gold-border)', white: '#ffffff', success: '#2d6a4f', warning: '#b08d57', error: '#a4343a',
}

/* ── ASUKA PRODUCT CATALOGUE ── */
const PRODUCTS = [
  { name: 'Black Suede Biker Jacket Set', price: 21500, type: 'Jacket Set', fabric: 'Suede + Stretch', occasion: ['party', 'casual', 'concert'], style: ['edgy', 'modern', 'western', 'bold'], slug: 'black-suede-biker-jacket-set', img: 'https://asukacouture.com/cdn/shop/files/D85AEB5B-A202-4CEF-8C57-0093265FBE13.jpg?v=1734897114&width=600' },
  { name: 'Charcoal Grey Woolen Suit Set', price: 30000, type: 'Suit Set', fabric: 'Wool blend', occasion: ['corporate', 'formal', 'reception'], style: ['sharp', 'tailored', 'classic'], slug: 'charcoal-grey-woolen-suit-set', img: 'https://asukacouture.com/cdn/shop/files/21BEFA8C-67CC-4AB0-AA40-36F136AA5BDA.png?v=1748530032&width=600' },
  { name: 'Off-White Pinstripe Ceremonial Ensemble', price: 31500, type: 'Ceremonial', fabric: 'Premium blend', occasion: ['wedding', 'sangeet', 'groom'], style: ['elegant', 'regal', 'festive'], slug: 'off-white-pinstripe-ceremonial-ensemble', img: 'https://asukacouture.com/cdn/shop/files/0DBB8109-2864-475F-AE8A-165F57F12C0C.png?v=1735413543&width=600' },
  { name: 'Black Floraison Dori Kurta Set', price: 28950, type: 'Kurta Set', fabric: 'Cotton blend', occasion: ['festive', 'diwali', 'eid', 'wedding guest'], style: ['embroidered', 'ethnic', 'statement'], slug: 'black-floraison-dori-embroidered-kurta-set', img: 'https://asukacouture.com/cdn/shop/files/6D002B97-FDCE-468C-B174-D65478C5E2EE.png?v=1735415385&width=600' },
  { name: 'Mystic Terrain Habutai Silk Shirt', price: 8950, type: 'Shirt', fabric: 'Habutai silk', occasion: ['casual', 'brunch', 'beach', 'resort'], style: ['relaxed', 'artistic', 'fusion'], slug: 'mystic-terrain-habutai-silk-shirt', img: 'https://asukacouture.com/cdn/shop/files/ASKMSH-00458_1.jpg?v=1712140000&width=600' },
  { name: 'Timeless Navy Pinstripe Suit', price: 24500, type: 'Suit', fabric: 'Wool blend', occasion: ['corporate', 'formal', 'office'], style: ['timeless', 'professional', 'classic'], slug: 'timeless-navy-pinstripe-suit', img: 'https://asukacouture.com/cdn/shop/files/suit_navy.jpg?width=600' },
  { name: 'Bespoke Sherwani', price: 45000, type: 'Sherwani', fabric: 'Raw silk brocade', occasion: ['wedding', 'baraat', 'groom'], style: ['regal', 'couture', 'traditional'], slug: 'bespoke-sherwani', img: 'https://asukacouture.com/cdn/shop/files/sherwani_gold.jpg?width=600' },
  { name: 'Indo-Western Bandhgala', price: 35000, type: 'Bandhgala', fabric: 'Wool-silk blend', occasion: ['reception', 'cocktail', 'engagement'], style: ['fusion', 'modern', 'structured'], slug: 'indo-western-bandhgala', img: 'https://asukacouture.com/cdn/shop/files/bandhgala_black.jpg?width=600' },
]

/* ── CONSTANTS ── */
const OCCASIONS = [
  { id: 'wedding_guest', label: 'Wedding Guest', icon: '\uD83D\uDC8D', tags: ['wedding', 'wedding guest'] },
  { id: 'groom', label: 'Groom', icon: '\uD83E\uDD35', tags: ['wedding', 'groom', 'baraat'] },
  { id: 'cocktail', label: 'Cocktail', icon: '\uD83C\uDF78', tags: ['cocktail', 'party'] },
  { id: 'reception', label: 'Reception', icon: '\uD83C\uDF89', tags: ['reception', 'party'] },
  { id: 'engagement', label: 'Engagement', icon: '\uD83D\uDC90', tags: ['engagement', 'cocktail'] },
  { id: 'corporate', label: 'Corporate', icon: '\uD83D\uDCBC', tags: ['corporate', 'formal', 'office'] },
  { id: 'festive', label: 'Festive', icon: '\u2728', tags: ['festive', 'diwali', 'eid'] },
  { id: 'sangeet', label: 'Sangeet', icon: '\uD83C\uDFB6', tags: ['sangeet', 'party', 'wedding'] },
]

const COLOR_PALETTE = [
  { name: 'Navy', hex: '#1B2A4A' }, { name: 'Black', hex: '#181818' },
  { name: 'Ivory', hex: '#F8F3E6' }, { name: 'Gold', hex: '#C9A84C' },
  { name: 'Maroon', hex: '#7A1C1C' }, { name: 'Emerald', hex: '#1A6040' },
  { name: 'Dusty Pink', hex: '#C47A8A' }, { name: 'Lavender', hex: '#9B8EC4' },
  { name: 'Sage', hex: '#6B8C6B' }, { name: 'Beige', hex: '#D8C890' },
  { name: 'Charcoal', hex: '#3A3A3A' }, { name: 'Burgundy', hex: '#6B1A2A' },
]

const BUDGETS = ['Under \u20B925K', '\u20B925K \u2013 \u20B950K', '\u20B950K \u2013 \u20B91L', '\u20B91L \u2013 \u20B92L', '\u20B92L \u2013 \u20B95L', '\u20B95L+']
const SKIN_TONES = [
  { name: 'Fair', hex: '#FDEBD0' }, { name: 'Light', hex: '#F5CBA7' },
  { name: 'Medium', hex: '#D4A574' }, { name: 'Olive', hex: '#C2956B' },
  { name: 'Brown', hex: '#8B6914' }, { name: 'Dark', hex: '#5C4033' },
]
const FIT_OPTIONS = ['Slim', 'Regular', 'Relaxed']

const LAPEL_TYPES = ['Notch', 'Peak', 'Shawl']
const BUTTON_TYPES = ['Single Breasted', 'Double Breasted']
const EMBROIDERY_LEVELS = ['None', 'Subtle', 'Medium', 'Heavy']
const FABRICS = ['Silk', 'Silk Blend', 'Linen', 'Cotton Silk', 'Velvet', 'Brocade', 'Wool Blend']
const LININGS = ['Standard', 'Contrast', 'Printed', 'Silk']
const MONOGRAM_POS = ['Inner Chest', 'Inner Collar', 'Cuff']

/* ── RESPONSIVE CSS ── */
const responsiveCSS = `
  @media (max-width: 640px) {
    .st-header-inner { padding: 0 16px !important; }
    .st-hero { padding: 40px 16px 32px !important; }
    .st-container { padding: 0 16px !important; padding-bottom: 60px !important; }
    .st-occasion-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .st-grid-2 { grid-template-columns: 1fr !important; }
    .st-skin-tones { gap: 8px !important; }
    .st-skin-tones button div:first-child { width: 32px !important; height: 32px !important; }
    .st-color-palette { gap: 6px !important; }
    .st-color-palette button { width: 34px !important; height: 34px !important; }
    .st-progress-steps { overflow-x: auto !important; gap: 2px !important; }
    .st-progress-steps > div { min-width: 60px !important; }
    .st-progress-steps span { font-size: 7px !important; }
    .st-hero h1 { font-size: 28px !important; }
    .st-chat-msg { max-width: 95% !important; }
    .st-product-cards { grid-template-columns: 1fr !important; }
    .st-customise-grid { grid-template-columns: 1fr !important; }
    .st-embroidery-btns { flex-wrap: wrap !important; }
    .st-embroidery-btns button { flex: 1 1 45% !important; }
    .st-summary-grid { grid-template-columns: 1fr !important; }
    .st-cta-row { flex-direction: column !important; }
  }
`

/* ── MOCK AI RESPONSES (fallback when Groq API is unavailable) ── */
function mockAIResponse(message: string, occasionId: string): { reply: string; products: typeof PRODUCTS } {
  const msg = message.toLowerCase()
  const occasionTags = OCCASIONS.find(o => o.id === occasionId)?.tags || []

  // Score each product by relevance to message + occasion
  const scored = PRODUCTS.map(p => {
    let score = 0
    // Occasion match
    for (const tag of occasionTags) {
      if (p.occasion.includes(tag)) score += 3
    }
    // Keyword match in message
    const keywords = [...p.occasion, ...p.style, p.type.toLowerCase(), p.fabric.toLowerCase()]
    for (const kw of keywords) {
      if (msg.includes(kw.toLowerCase())) score += 2
    }
    // Generic keyword boosts
    if (msg.includes('kurta') && p.type.toLowerCase().includes('kurta')) score += 5
    if (msg.includes('suit') && p.type.toLowerCase().includes('suit')) score += 5
    if (msg.includes('sherwani') && p.type.toLowerCase().includes('sherwani')) score += 5
    if (msg.includes('bandhgala') && p.type.toLowerCase().includes('bandhgala')) score += 5
    if (msg.includes('jacket') && p.type.toLowerCase().includes('jacket')) score += 5
    if (msg.includes('shirt') && p.type.toLowerCase().includes('shirt')) score += 5
    if ((msg.includes('dark') || msg.includes('black') || msg.includes('navy')) && (p.name.toLowerCase().includes('black') || p.name.toLowerCase().includes('navy') || p.name.toLowerCase().includes('charcoal'))) score += 3
    if ((msg.includes('bold') || msg.includes('statement') || msg.includes('edgy')) && p.style.includes('bold')) score += 3
    if ((msg.includes('classic') || msg.includes('elegant') || msg.includes('timeless')) && (p.style.includes('classic') || p.style.includes('elegant'))) score += 3
    if ((msg.includes('wedding') || msg.includes('groom')) && p.occasion.includes('wedding')) score += 4
    if ((msg.includes('indo') || msg.includes('fusion') || msg.includes('western')) && p.style.includes('fusion')) score += 4
    if ((msg.includes('festive') || msg.includes('diwali') || msg.includes('eid')) && p.occasion.includes('festive')) score += 4
    return { product: p, score }
  }).sort((a, b) => b.score - a.score)

  const top = scored.slice(0, 3).filter(s => s.score > 0)
  if (top.length === 0) {
    // Default: return top 2 by occasion
    const defaults = scored.slice(0, 2)
    const names = defaults.map(d => `**${d.product.name}**`)
    return {
      reply: `Based on what you've shared, I'd suggest exploring:\n\n${names[0]} — a versatile piece that works beautifully for your occasion. Priced at \u20B9${defaults[0].product.price.toLocaleString('en-IN')}.\n\n${names.length > 1 ? `${names[1]} — another excellent option at \u20B9${defaults[1].product.price.toLocaleString('en-IN')}.\n\n` : ''}Would you like me to explore a specific direction — perhaps a colour palette or particular silhouette?`,
      products: defaults.map(d => d.product),
    }
  }

  const recs = top.map(t => t.product)
  let reply = `Excellent taste. Here are my top picks for you:\n\n`
  recs.forEach((p, i) => {
    const tips = [
      'Pair with monk straps and a vintage watch for effortless polish.',
      'Style with leather juttis and a silk pocket square.',
      'Add a brooch or statement buttons for that extra edge.',
    ]
    reply += `${i + 1}. **${p.name}** (\u20B9${p.price.toLocaleString('en-IN')}) — ${p.fabric}, perfect for ${p.occasion[0]}. ${tips[i] || ''}\n\n`
  })
  reply += `Shall I narrow this down, or would you like to customise one of these?`
  return { reply, products: recs }
}

/* ── BOLD RENDERER ── */
function BoldText({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: T.accent, fontWeight: 500 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )}</>
}

/* ── PRODUCT CARD ── */
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <div style={{
      border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.03)', padding: '0', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Product Image */}
      <div style={{
        height: '140px', background: T.bgAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}>
        {product.img ? (
          <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="48" height="60" viewBox="0 0 160 220" fill="none" style={{ opacity: 0.25 }}>
            <path d="M55,45 L40,65 L33,140 L127,140 L120,65 L105,45 L92,40 C86,72 74,72 68,40 Z" stroke={T.accent} strokeWidth="2" />
            <path d="M68,40 L80,58 L92,40" stroke={T.accent} strokeWidth="2" />
          </svg>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: T.text, marginBottom: '4px', lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ fontSize: '11px', color: T.textMuted, marginBottom: '6px' }}>{product.type} &middot; {product.fabric}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: T.accent }}>{'\u20B9'}{product.price.toLocaleString('en-IN')}</span>
          <a href={`https://asukacouture.com/products/${product.slug}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', background: T.accent, textDecoration: 'none', padding: '6px 12px' }}>
            View
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── CHAT MESSAGE TYPE ── */
type ChatMsg = { role: 'user' | 'assistant'; content: string; products?: typeof PRODUCTS }

export default function StylistPage() {
  const [step, setStep] = useState(0)

  // Step 1 — Occasion & Vibe
  const [occasion, setOccasion] = useState('')
  const [location, setLocation] = useState<'indoor' | 'outdoor' | ''>('')
  const [city, setCity] = useState('')
  const [time, setTime] = useState<'day' | 'night' | ''>('')
  const [vibeClassicBold, setVibeClassicBold] = useState(50)
  const [vibeMinimalEmb, setVibeMinimalEmb] = useState(30)
  const [colorPrefs, setColorPrefs] = useState<string[]>([])
  const [colorAvoid, setColorAvoid] = useState<string[]>([])
  const [budget, setBudget] = useState('')

  // Step 2 — Personal
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [skinTone, setSkinTone] = useState('')
  const [fitPref, setFitPref] = useState('Regular')
  const [ownedItems, setOwnedItems] = useState<string[]>([])
  const [ownedInput, setOwnedInput] = useState('')

  // Step 3 — Chat
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [sessionId] = useState(() => `style_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
  const [designSummary, setDesignSummary] = useState<string | null>(null)
  const [selectedLook, setSelectedLook] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  // Step 4 — Customization
  const [lapel, setLapel] = useState('Notch')
  const [buttons, setButtons] = useState('Single Breasted')
  const [embroidery, setEmbroidery] = useState('Subtle')
  const [fabric, setFabric] = useState('Silk Blend')
  const [lining, setLining] = useState('Standard')
  const [monogram, setMonogram] = useState('')
  const [monogramPos, setMonogramPos] = useState('Inner Chest')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, chatLoading])

  // Build context summary for AI
  const buildContext = () => {
    const parts = []
    if (occasion) parts.push(`Occasion: ${OCCASIONS.find(o => o.id === occasion)?.label}`)
    if (location) parts.push(`Setting: ${location}`)
    if (city) parts.push(`City: ${city}`)
    if (time) parts.push(`Time: ${time}`)
    parts.push(`Vibe: ${vibeClassicBold < 35 ? 'classic' : vibeClassicBold > 65 ? 'bold' : 'balanced'}, ${vibeMinimalEmb < 35 ? 'minimal' : vibeMinimalEmb > 65 ? 'embellished' : 'refined'}`)
    if (colorPrefs.length) parts.push(`Preferred colors: ${colorPrefs.join(', ')}`)
    if (colorAvoid.length) parts.push(`Avoid colors: ${colorAvoid.join(', ')}`)
    if (budget) parts.push(`Budget: ${budget}`)
    if (fitPref) parts.push(`Fit: ${fitPref}`)
    if (height) parts.push(`Height: ${height}`)
    if (skinTone) parts.push(`Skin tone: ${skinTone}`)
    return parts.join('\n')
  }

  /* ── Extract product names mentioned with **Name** in AI reply ── */
  const extractMentionedProducts = (text: string): typeof PRODUCTS => {
    const mentioned: typeof PRODUCTS = []
    const boldMatches = text.match(/\*\*(.*?)\*\*/g)
    if (boldMatches) {
      for (const m of boldMatches) {
        const name = m.slice(2, -2).toLowerCase()
        const found = PRODUCTS.find(p => p.name.toLowerCase().includes(name) || name.includes(p.name.toLowerCase()))
        if (found && !mentioned.includes(found)) mentioned.push(found)
      }
    }
    return mentioned
  }

  // Start chat with context
  const startChat = () => {
    const occasionLabel = OCCASIONS.find(o => o.id === occasion)?.label || 'special'
    const vibeLabel = vibeClassicBold < 35 ? 'classic' : vibeClassicBold > 65 ? 'bold' : 'refined'
    const colorNote = colorPrefs.length ? `, in ${colorPrefs.join(' & ')}` : ''

    // Generate initial product suggestions via mock
    const initMsg = `Suggest looks for a ${occasionLabel} occasion, ${vibeLabel} vibe${colorNote}`
    const mock = mockAIResponse(initMsg, occasion)

    const welcome: ChatMsg = {
      role: 'assistant',
      content: `Welcome to Asuka Couture's styling studio. Based on your preferences \u2014 a **${occasionLabel}** occasion, ${vibeLabel} vibe${colorNote} \u2014 I have some wonderful directions for you.\n\n${mock.reply}`,
      products: mock.products,
    }
    setMsgs([welcome])
    setStep(2)

    // Also send context to API in background (if available)
    const ctx = buildContext()
    sendToAPI(ctx, true)
  }

  const sendToAPI = useCallback(async (message: string, isContext = false) => {
    setChatLoading(true)
    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (!isContext && data.reply) {
        const products = extractMentionedProducts(data.reply)
        setMsgs(m => [...m, { role: 'assistant', content: data.reply, products: products.length > 0 ? products : undefined }])
      }
    } catch {
      // Mock fallback when API is unavailable
      if (!isContext) {
        const mock = mockAIResponse(message, occasion)
        setMsgs(m => [...m, { role: 'assistant', content: mock.reply, products: mock.products.length > 0 ? mock.products : undefined }])
      }
    }
    setChatLoading(false)
    chatInputRef.current?.focus()
  }, [sessionId, occasion])

  const sendChat = useCallback(async (txt: string) => {
    if (!txt.trim() || chatLoading) return
    setMsgs(m => [...m, { role: 'user', content: txt }])
    setChatInput('')
    await sendToAPI(txt)
  }, [chatLoading, sendToAPI])

  const addOwnedItem = () => {
    if (ownedInput.trim() && ownedItems.length < 8) {
      setOwnedItems([...ownedItems, ownedInput.trim()])
      setOwnedInput('')
    }
  }

  const toggleColor = (name: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(name) ? list.filter(c => c !== name) : [...list, name])
  }

  const canProceedStep1 = occasion && budget
  const STEPS = ['Occasion & Vibe', 'Personal Details', 'AI Stylist Chat', 'Customise', 'Your Brief']

  /* ── Dynamic Concept Preview Color ── */
  const previewAccent = colorPrefs.length > 0
    ? COLOR_PALETTE.find(c => c.name === colorPrefs[0])?.hex || T.accent
    : T.accent

  const whatsappBrief = () => {
    const parts = [
      `Hi, I designed a look using the Asuka AI Stylist.`,
      ``,
      `Occasion: ${OCCASIONS.find(o => o.id === occasion)?.label || occasion}`,
      `Vibe: ${vibeClassicBold < 35 ? 'Classic' : vibeClassicBold > 65 ? 'Bold' : 'Balanced'}`,
      colorPrefs.length ? `Colors: ${colorPrefs.join(', ')}` : '',
      `Budget: ${budget}`,
      `Fit: ${fitPref}`,
      height ? `Height: ${height}` : '',
      weight ? `Weight: ${weight}` : '',
      ``,
      `Customisation:`,
      `Lapel: ${lapel}`,
      `Buttons: ${buttons}`,
      `Embroidery: ${embroidery}`,
      `Fabric: ${fabric}`,
      `Lining: ${lining}`,
      monogram ? `Monogram: ${monogram} (${monogramPos})` : '',
      ``,
      selectedLook ? `Selected look: ${selectedLook}` : '',
      designSummary ? `\nDesign Brief:\n${designSummary}` : '',
      ``,
      `I'd like to proceed with this design.`,
    ].filter(Boolean)
    return encodeURIComponent(parts.join('\n'))
  }

  /* ── Shared label style ── */
  const lbl: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: T.textMuted, marginBottom: '8px', display: 'block' }
  const inp: React.CSSProperties = { width: '100%', background: T.bg, border: `1px solid ${T.border}`, color: T.text, fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 400, padding: '12px 16px', outline: 'none', transition: 'border-color 0.2s' }
  const sel: React.CSSProperties = { ...inp, appearance: 'none' as const, cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b6b6b' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }
  const btnP: React.CSSProperties = { width: '100%', padding: '16px', background: T.accent, color: T.white, border: 'none', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s' }
  const btnO: React.CSSProperties = { ...btnP, background: 'transparent', color: T.accent, border: `1px solid ${T.accent}` }
  const btnG: React.CSSProperties = { ...btnP, background: 'transparent', color: T.textMuted, border: 'none', padding: '12px', fontSize: '11px' }

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: 'var(--font-sans), sans-serif', fontWeight: 300, minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />

      <Header />

      {/* Hero */}
      <div className="st-hero" style={{ background: T.bgAlt, padding: '120px 24px 100px', textAlign: 'center', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.5em', textTransform: 'uppercase', color: T.accent, marginBottom: '24px' }}>The Digital Atelier</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 300, color: T.text, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '2px' }}>
          Design Your <em style={{ color: T.accent, fontStyle: 'italic' }}>Dream</em> Outfit
        </h1>
        <p style={{ fontSize: '15px', color: T.textMuted, maxWidth: '580px', margin: '0 auto', lineHeight: 1.8, letterSpacing: '0.5px' }}>
          Consult with our AI concierge to envision your next masterpiece. From ceremonial ethnic to sharp western silhouettes, we bring your fashion journey to life.
        </p>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px clamp(16px, 4vw, 24px) 0' }}>
        <div className="st-progress-steps" style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px', overflowX: 'auto' }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: '80px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 500, transition: 'all 0.3s',
                  background: i <= step ? T.accent : T.bg, color: i <= step ? T.white : T.textMuted,
                  border: i <= step ? `2px solid ${T.accent}` : `2px solid ${T.border}`,
                }}>
                  {i < step ? '\u2713' : i + 1}
                </div>
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: i <= step ? T.accent : T.textMuted, marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ height: '2px', flex: '0 0 clamp(12px, 3vw, 24px)', background: i < step ? T.accent : T.border, transition: 'background 0.3s', marginBottom: '22px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Steps Container */}
      <div className="st-container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)', paddingBottom: '80px' }}>

        {/* ═══ STEP 1: Occasion & Vibe ═══ */}
        {step === 0 && (
          <div>
            {/* Occasion */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>What&apos;s the occasion?</label>
              <div className="st-occasion-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {OCCASIONS.map(o => (
                  <button type="button" key={o.id} onClick={() => setOccasion(o.id)}
                    style={{
                      padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      border: `1px solid ${occasion === o.id ? T.accent : T.border}`,
                      background: occasion === o.id ? T.bgAccent : T.bg,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    <span style={{ fontSize: '24px' }}>{o.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: occasion === o.id ? T.accent : T.textMuted }}>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location + Time */}
            <div className="st-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={lbl}>Setting</label>
                <div style={{ display: 'flex', gap: '0' }}>
                  {(['indoor', 'outdoor'] as const).map((l, i) => (
                    <button type="button" key={l} onClick={() => setLocation(l)}
                      style={{
                        flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: 400, textTransform: 'capitalize' as const,
                        border: `1px solid ${location === l ? T.accent : T.border}`,
                        borderLeft: i > 0 ? 'none' : undefined,
                        background: location === l ? T.accent : T.bg,
                        color: location === l ? T.white : T.text,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>Time</label>
                <div style={{ display: 'flex', gap: '0' }}>
                  {(['day', 'night'] as const).map((t, i) => (
                    <button type="button" key={t} onClick={() => setTime(t)}
                      style={{
                        flex: 1, padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: 400, textTransform: 'capitalize' as const,
                        border: `1px solid ${time === t ? T.accent : T.border}`,
                        borderLeft: i > 0 ? 'none' : undefined,
                        background: time === t ? T.accent : T.bg,
                        color: time === t ? T.white : T.text,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      {t === 'day' ? '\u2600 Day' : '\uD83C\uDF19 Night'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* City */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>City (optional)</label>
              <input style={inp} placeholder="e.g. Mumbai, Delhi, Jaipur..." value={city} onChange={e => setCity(e.target.value)} />
            </div>

            {/* Vibe Sliders */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>Vibe</label>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: T.textMuted, marginBottom: '6px' }}>
                  <span>Classic</span><span>Bold</span>
                </div>
                <input type="range" min="0" max="100" value={vibeClassicBold} onChange={e => setVibeClassicBold(Number(e.target.value))}
                  style={{ width: '100%', accentColor: T.accent, height: '4px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: T.textMuted, marginBottom: '6px' }}>
                  <span>Minimal</span><span>Embellished</span>
                </div>
                <input type="range" min="0" max="100" value={vibeMinimalEmb} onChange={e => setVibeMinimalEmb(Number(e.target.value))}
                  style={{ width: '100%', accentColor: T.accent, height: '4px' }} />
              </div>
            </div>

            {/* Color Preferences */}
            <div style={{ marginBottom: '24px' }}>
              <label style={lbl}>Color Preferences</label>
              <div className="st-color-palette" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLOR_PALETTE.map(c => (
                  <button type="button" key={c.name} onClick={() => toggleColor(c.name, colorPrefs, setColorPrefs)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%', border: colorPrefs.includes(c.name) ? `3px solid ${T.accent}` : '2px solid #ddd',
                      background: c.hex, cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                      transform: colorPrefs.includes(c.name) ? 'scale(1.1)' : 'scale(1)',
                    }}
                    title={c.name}>
                    {colorPrefs.includes(c.name) && (
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.hex === '#F8F3E6' || c.hex === '#D8C890' || c.hex === '#C9A84C' ? '#333' : '#fff', fontSize: '14px', fontWeight: 'bold' }}>{'\u2713'}</span>
                    )}
                  </button>
                ))}
              </div>
              {colorPrefs.length > 0 && (
                <div style={{ fontSize: '12px', color: T.accent, marginTop: '8px' }}>Selected: {colorPrefs.join(', ')}</div>
              )}
            </div>

            {/* Colors to Avoid */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>Colors to Avoid (optional)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLOR_PALETTE.map(c => (
                  <button type="button" key={`avoid-${c.name}`} onClick={() => toggleColor(c.name, colorAvoid, setColorAvoid)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', border: colorAvoid.includes(c.name) ? `2px solid ${T.error}` : '1px solid #ddd',
                      background: c.hex, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', opacity: colorAvoid.includes(c.name) ? 0.5 : 0.7,
                    }}
                    title={`Avoid ${c.name}`}>
                    {colorAvoid.includes(c.name) && (
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.error, fontSize: '18px', fontWeight: 'bold' }}>{'\u2715'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: '40px' }}>
              <label style={lbl}>Budget Range</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BUDGETS.map(b => (
                  <button type="button" key={b} onClick={() => setBudget(b)}
                    style={{
                      padding: '9px 18px', fontSize: '12px', fontWeight: 400,
                      border: `1px solid ${budget === b ? T.accent : T.border}`,
                      background: budget === b ? T.bgAccent : T.bg,
                      color: budget === b ? T.accent : T.textMuted,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={() => setStep(1)} disabled={!canProceedStep1}
              style={{ ...btnP, opacity: canProceedStep1 ? 1 : 0.4, cursor: canProceedStep1 ? 'pointer' : 'not-allowed' }}>
              Continue
            </button>
          </div>
        )}

        {/* ═══ STEP 2: Personal Details ═══ */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color: T.text, marginBottom: '8px' }}>About You</h2>
              <p style={{ fontSize: '14px', color: T.textMuted }}>Help us personalise your styling recommendations.</p>
            </div>

            {/* Height & Weight */}
            <div className="st-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={lbl}>Height (optional)</label>
                <input style={inp} placeholder="e.g. 5'10 or 178 cm" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Weight (optional)</label>
                <input style={inp} placeholder="e.g. 78 kg" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>

            {/* Skin Tone */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>Skin Tone (optional — helps with color recommendations)</label>
              <div className="st-skin-tones" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {SKIN_TONES.map(s => (
                  <button type="button" key={s.name} onClick={() => setSkinTone(skinTone === s.name ? '' : s.name)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', background: s.hex,
                      border: skinTone === s.name ? `3px solid ${T.accent}` : `2px solid ${T.border}`,
                      transform: skinTone === s.name ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }} />
                    <span style={{ fontSize: '10px', fontWeight: 500, color: skinTone === s.name ? T.accent : T.textMuted }}>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Preference */}
            <div style={{ marginBottom: '32px' }}>
              <label style={lbl}>Fit Preference</label>
              <div style={{ display: 'flex', gap: '0' }}>
                {FIT_OPTIONS.map((f, i) => (
                  <button type="button" key={f} onClick={() => setFitPref(f)}
                    style={{
                      flex: 1, padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 500,
                      border: `1px solid ${fitPref === f ? T.accent : T.border}`,
                      borderLeft: i > 0 ? 'none' : undefined,
                      background: fitPref === f ? T.accent : T.bg,
                      color: fitPref === f ? T.white : T.text,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Items You Own */}
            <div style={{ marginBottom: '40px' }}>
              <label style={lbl}>Items you already own to style with (optional)</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input style={{ ...inp, flex: 1 }} placeholder="e.g. navy blazer, white shoes, gold watch..."
                  value={ownedInput} onChange={e => setOwnedInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addOwnedItem()} />
                <button type="button" onClick={addOwnedItem} style={{ padding: '12px 20px', background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text, cursor: 'pointer', fontSize: '16px' }}>+</button>
              </div>
              {ownedItems.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {ownedItems.map((item, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: T.bgAccent, border: `1px solid ${T.border}`, fontSize: '12px', color: T.accent, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {item}
                      <button type="button" onClick={() => setOwnedItems(ownedItems.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: '14px', padding: '0' }}>{'\u2715'}</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="st-cta-row" style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setStep(0)} style={{ ...btnG, flex: '0 0 auto', padding: '16px 24px' }}>{'\u2190'} Back</button>
              <button type="button" onClick={startChat} style={{ ...btnP, flex: 1 }}>Chat with AI Stylist</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: AI Chat ═══ */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color: T.text, marginBottom: '4px' }}>Your AI Stylist</h2>
              <p style={{ fontSize: '13px', color: T.textMuted }}>Describe what you envision. Get personalized look suggestions with product recommendations.</p>
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {[
                'Suggest 2-3 looks for me',
                'Something dark and elegant',
                'Show me bold options',
                'I want a kurta option',
                'What about Indo-Western?',
              ].map(q => (
                <button type="button" key={q} onClick={() => sendChat(q)}
                  style={{
                    padding: '6px 14px', border: `1px solid ${T.border}`, background: T.bg,
                    fontSize: '11px', fontWeight: 400, color: T.textMuted, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '12px', padding: '8px 0' }}>
              {msgs.map((m, i) => (
                <div key={i} className="animate-fadeUp" style={{ marginBottom: '16px' }}>
                  {/* Message bubble */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: m.role === 'user' ? T.accent : T.textMuted, marginBottom: '4px' }}>
                      {m.role === 'assistant' ? 'Ayaan \u00B7 Asuka Stylist' : 'You'}
                    </span>
                    <div className="st-chat-msg" style={{
                      maxWidth: '85%', padding: '14px 18px', fontSize: '13px', lineHeight: 1.7,
                      color: T.text,
                      background: m.role === 'user' ? T.bgAccent : T.bgAlt,
                      border: `1px solid ${m.role === 'user' ? 'rgba(143,101,77,0.15)' : T.border}`,
                    }}>
                      {m.content.split('\n').map((line, j) => (
                        <span key={j}><BoldText text={line} />{j < m.content.split('\n').length - 1 && <br />}</span>
                      ))}
                    </div>
                  </div>

                  {/* Product Cards (shown after assistant messages with products) */}
                  {m.role === 'assistant' && m.products && m.products.length > 0 && (
                    <div className="st-product-cards" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(m.products.length, 3)}, 1fr)`, gap: '12px', marginTop: '12px', maxWidth: '85%' }}>
                      {m.products.map(p => (
                        <ProductCard key={p.name} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '4px' }}>Ayaan {'\u00B7'} Asuka Stylist</span>
                  <div style={{ padding: '14px 18px', fontSize: '13px', color: T.textMuted, background: T.bgAlt, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '14px', height: '14px', border: `2px solid ${T.border}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Styling...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
              <input ref={chatInputRef} value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat(chatInput)}
                placeholder="Tell me about the look you want..."
                disabled={chatLoading}
                style={{ ...inp, flex: 1, borderColor: T.border }} />
              <VoiceInput onTranscription={(txt) => sendChat(txt)} isChatLoading={chatLoading} />
              <button type="button" onClick={() => sendChat(chatInput)} disabled={chatLoading || !chatInput.trim()}
                style={{ padding: '12px 20px', background: T.accent, color: T.white, border: 'none', fontSize: '14px', cursor: (chatLoading || !chatInput.trim()) ? 'not-allowed' : 'pointer', opacity: (chatLoading || !chatInput.trim()) ? 0.4 : 1 }}>
                {'\u2192'}
              </button>
            </div>

            {/* Action buttons */}
            <div className="st-cta-row" style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ ...btnG, flex: '0 0 auto', padding: '16px 24px' }}>{'\u2190'} Back</button>
              <button type="button" onClick={() => setStep(3)} style={{ ...btnP, flex: 1 }}>
                Customise My Look {'\u2192'}
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Customisation ═══ */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color: T.text, marginBottom: '8px' }}>Customise Your Look</h2>
              <p style={{ fontSize: '14px', color: T.textMuted }}>Fine-tune every detail to make it truly yours.</p>
            </div>

            {/* Dynamic Concept Preview */}
            <div style={{
              aspectRatio: '3/4', maxHeight: '420px', width: '100%', margin: '0 auto 24px',
              border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden', background: T.bgAlt
            }}>
              <img 
                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(`luxury Indian bespoke menswear, ${designSummary || 'couture outfit'}, editorial photography, 8k, dramatic lighting, white studio background`)}?width=600&height=800&nologo=true&seed=${(designSummary || '').length}`}
                alt="AI Design Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${T.border}` }}>
                 <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: T.white, textTransform: 'uppercase' }}>AI Concierge Preview</div>
              </div>
            </div>

            {/* Customisation options */}
            <div className="st-customise-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Lapel */}
              <div>
                <label style={lbl}>Lapel Type</label>
                <div style={{ display: 'flex', gap: '0' }}>
                  {LAPEL_TYPES.map((l, i) => (
                    <button type="button" key={l} onClick={() => setLapel(l)} style={{
                      flex: 1, padding: '10px 6px', textAlign: 'center', fontSize: '11px', fontWeight: 500,
                      border: `1px solid ${lapel === l ? T.accent : T.border}`,
                      borderLeft: i > 0 ? 'none' : undefined,
                      background: lapel === l ? T.accent : T.bg, color: lapel === l ? T.white : T.text,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Button Stance */}
              <div>
                <label style={lbl}>Button Stance</label>
                <div style={{ display: 'flex', gap: '0' }}>
                  {BUTTON_TYPES.map((b, i) => (
                    <button type="button" key={b} onClick={() => setButtons(b)} style={{
                      flex: 1, padding: '10px 6px', textAlign: 'center', fontSize: '10px', fontWeight: 500,
                      border: `1px solid ${buttons === b ? T.accent : T.border}`,
                      borderLeft: i > 0 ? 'none' : undefined,
                      background: buttons === b ? T.accent : T.bg, color: buttons === b ? T.white : T.text,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{b}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Embroidery */}
            <div style={{ marginBottom: '24px' }}>
              <label style={lbl}>Embroidery Intensity</label>
              <div className="st-embroidery-btns" style={{ display: 'flex', gap: '8px' }}>
                {EMBROIDERY_LEVELS.map(e => (
                  <button type="button" key={e} onClick={() => setEmbroidery(e)}
                    style={{
                      flex: 1, padding: '10px', textAlign: 'center', fontSize: '12px', fontWeight: 400,
                      border: `1px solid ${embroidery === e ? T.accent : T.border}`,
                      background: embroidery === e ? T.bgAccent : T.bg,
                      color: embroidery === e ? T.accent : T.textMuted,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric + Lining */}
            <div className="st-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={lbl}>Fabric</label>
                <select style={sel} value={fabric} onChange={e => setFabric(e.target.value)}>
                  {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Lining</label>
                <select style={sel} value={lining} onChange={e => setLining(e.target.value)}>
                  {LININGS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Monogram */}
            <div style={{ marginBottom: '40px' }}>
              <label style={lbl}>Monogram (optional)</label>
              <div className="st-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input style={inp} placeholder="Max 4 characters" maxLength={4} value={monogram} onChange={e => setMonogram(e.target.value.toUpperCase())} />
                <select style={sel} value={monogramPos} onChange={e => setMonogramPos(e.target.value)}>
                  {MONOGRAM_POS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {monogram && (
                <div style={{ marginTop: '12px', padding: '16px', background: T.bgAlt, border: `1px solid ${T.border}`, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color: T.accent, letterSpacing: '6px' }}>{monogram}</span>
                  <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '4px' }}>Placement: {monogramPos}</div>
                </div>
              )}
            </div>

            <div className="st-cta-row" style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setStep(2)} style={{ ...btnG, flex: '0 0 auto', padding: '16px 24px' }}>{'\u2190'} Back</button>
              <button type="button" onClick={() => setStep(4)} style={{ ...btnP, flex: 1 }}>Finalize & Review</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 5: Handover Brief ═══ */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color: T.text, marginBottom: '8px' }}>Your Design Brief</h2>
              <p style={{ fontSize: '14px', color: T.textMuted }}>Review your selections. Our stylists will bring this to life.</p>
            </div>

            {/* Summary Card */}
            <div className="animate-fadeUp" style={{ border: `1px solid ${T.border}`, padding: '32px', marginBottom: '24px', background: T.bgAlt }}>
              {/* Occasion & Vibe */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accent, marginBottom: '12px' }}>Occasion & Style</div>
                <div className="st-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: T.text }}>
                  <div><span style={{ color: T.textMuted }}>Occasion:</span> {OCCASIONS.find(o => o.id === occasion)?.label}</div>
                  <div><span style={{ color: T.textMuted }}>Setting:</span> {location || '\u2014'} {city ? `(${city})` : ''}</div>
                  <div><span style={{ color: T.textMuted }}>Time:</span> {time || '\u2014'}</div>
                  <div><span style={{ color: T.textMuted }}>Budget:</span> {budget}</div>
                  <div><span style={{ color: T.textMuted }}>Fit:</span> {fitPref}</div>
                  <div><span style={{ color: T.textMuted }}>Vibe:</span> {vibeClassicBold < 35 ? 'Classic' : vibeClassicBold > 65 ? 'Bold' : 'Balanced'}, {vibeMinimalEmb < 35 ? 'Minimal' : vibeMinimalEmb > 65 ? 'Embellished' : 'Refined'}</div>
                </div>
                {colorPrefs.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '13px' }}>
                    <span style={{ color: T.textMuted }}>Colors:</span> <span style={{ color: T.accent }}>{colorPrefs.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Personal */}
              {(height || weight || skinTone) && (
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accent, marginBottom: '12px' }}>Personal Details</div>
                  <div className="st-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: T.text }}>
                    {height && <div><span style={{ color: T.textMuted }}>Height:</span> {height}</div>}
                    {weight && <div><span style={{ color: T.textMuted }}>Weight:</span> {weight}</div>}
                    {skinTone && <div><span style={{ color: T.textMuted }}>Skin Tone:</span> {skinTone}</div>}
                  </div>
                </div>
              )}

              {/* Customisation */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accent, marginBottom: '12px' }}>Customisation</div>
                <div className="st-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: T.text }}>
                  <div><span style={{ color: T.textMuted }}>Lapel:</span> {lapel}</div>
                  <div><span style={{ color: T.textMuted }}>Buttons:</span> {buttons}</div>
                  <div><span style={{ color: T.textMuted }}>Embroidery:</span> {embroidery}</div>
                  <div><span style={{ color: T.textMuted }}>Fabric:</span> {fabric}</div>
                  <div><span style={{ color: T.textMuted }}>Lining:</span> {lining}</div>
                  {monogram && <div><span style={{ color: T.textMuted }}>Monogram:</span> {monogram} ({monogramPos})</div>}
                </div>
              </div>

              {/* Owned items */}
              {ownedItems.length > 0 && (
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accent, marginBottom: '8px' }}>Styling With</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ownedItems.map((item, i) => (
                      <span key={i} style={{ padding: '4px 10px', background: T.bgAccent, border: `1px solid ${T.border}`, fontSize: '12px', color: T.accent }}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div style={{ padding: '16px', background: T.bgAccent, border: `1px solid rgba(143,101,77,0.15)`, marginBottom: '32px', fontSize: '13px', color: T.textMuted, lineHeight: 1.6, textAlign: 'center' }}>
              Our style consultants will review your brief and reach out within <strong style={{ color: T.accent }}>2 hours</strong> during business hours (10 AM \u2013 8 PM IST).
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href={`https://wa.me/919810021030?text=${whatsappBrief()}`} target="_blank" rel="noopener noreferrer"
                style={{ ...btnP, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.229A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.357 0-4.545-.68-6.398-1.852l-.29-.178-3.005.792.805-2.941-.196-.312A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                Continue on WhatsApp
              </a>
              <a href="https://asukacouture.com/pages/bespoke" target="_blank" rel="noopener noreferrer"
                style={{ ...btnO, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Schedule a Styling Call
              </a>
              <button type="button" onClick={() => {
                const brief = `Asuka Couture Design Brief\n\nOccasion: ${OCCASIONS.find(o => o.id === occasion)?.label}\nBudget: ${budget}\nFit: ${fitPref}\nColors: ${colorPrefs.join(', ')}\n\nCustomisation:\nLapel: ${lapel}\nButtons: ${buttons}\nEmbroidery: ${embroidery}\nFabric: ${fabric}\nLining: ${lining}\n${monogram ? `Monogram: ${monogram} (${monogramPos})` : ''}`
                navigator.clipboard.writeText(brief).then(() => alert('Brief copied to clipboard!'))
              }} style={{ ...btnG, color: T.accent }}>
                Copy Brief to Clipboard
              </button>
            </div>

            {/* Edit / Start Over */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setStep(3)} style={{ ...btnG, color: T.textMuted, fontSize: '12px' }}>{'\u2190'} Edit Customisation</button>
              <button type="button" onClick={() => { setStep(0); setMsgs([]); setDesignSummary(null) }} style={{ ...btnG, color: T.textMuted, fontSize: '12px' }}>Start Over</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
