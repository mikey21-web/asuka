'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ─── BRAND SIZE MAPPING TABLE ─────────────────────────────────────
   Format: { brand → { productType → { brandSize → asukaSize } } }
   Asuka runs slightly larger than western brands.
   ─────────────────────────────────────────────────────────────────── */
const BRAND_MAP: Record<string, Record<string, Record<string, string>>> = {
  'Zara': {
    'shirt': { XS: '36', S: '38', M: '40', L: '42', XL: '44', XXL: '46' },
    'blazer': { XS: '36', S: '38', M: '40', L: '42', XL: '44', XXL: '46' },
    'trousers': { '28': '28', '30': '30', '32': '32', '34': '34', '36': '36', '38': '38' },
  },
  'H&M': {
    'shirt': { XS: '36', S: '38', M: '40', L: '42', XL: '44', XXL: '46' },
    'blazer': { XS: '36', S: '38', M: '40', L: '42', XL: '44', XXL: '46' },
    'trousers': { '28': '28', '30': '30', '32': '32', '34': '34', '36': '36', '38': '38' },
  },
  'Raymond': {
    'shirt': { '38': '38', '40': '40', '42': '42', '44': '44', '46': '46', '48': '48' },
    'suit': { '36': '36', '38': '38', '40': '40', '42': '42', '44': '44', '46': '46' },
    'trousers': { '30': '30', '32': '32', '34': '34', '36': '36', '38': '38', '40': '40' },
  },
  'Manyavar': {
    'kurta': { S: '38', M: '40', L: '42', XL: '44', XXL: '46', '3XL': '48' },
    'sherwani': { S: '38', M: '40', L: '42', XL: '44', XXL: '46', '3XL': '48' },
    'bundi': { S: '38', M: '40', L: '42', XL: '44', XXL: '46', '3XL': '48' },
  },
  'Louis Philippe': {
    'shirt': { '38': '38', '39': '40', '40': '40', '42': '42', '44': '44', '46': '46' },
    'suit': { '36': '38', '38': '40', '40': '42', '42': '44', '44': '44', '46': '46' },
    'trousers': { '30': '30', '32': '32', '34': '34', '36': '36', '38': '38', '40': '40' },
  },
  'Peter England': {
    'shirt': { '38': '38', '40': '40', '42': '42', '44': '44', '46': '46', '48': '48' },
    'suit': { '36': '38', '38': '40', '40': '42', '42': '44', '44': '44', '46': '46' },
  },
  'Park Avenue': {
    'shirt': { '38': '38', '40': '40', '42': '42', '44': '44', '46': '46' },
    'suit': { '36': '38', '38': '40', '40': '42', '42': '44', '44': '46' },
  },
  'Van Heusen': {
    'shirt': { '39': '38', '40': '40', '42': '42', '44': '44', '46': '46', '48': '48' },
    'trousers': { '30': '30', '32': '32', '34': '34', '36': '36', '38': '38', '40': '40' },
  },
  'Allen Solly': {
    'shirt': { 'S': '38', 'M': '40', 'L': '42', 'XL': '44', 'XXL': '46' },
    'trousers': { '30': '30', '32': '32', '34': '34', '36': '36', '38': '38', '40': '40' },
  },
  'Fabindia': {
    'kurta': { 'S': '38', 'M': '40', 'L': '42', 'XL': '44', 'XXL': '46', '3XL': '48' },
    'shirt': { 'S': '38', 'M': '40', 'L': '42', 'XL': '44', 'XXL': '46' },
  },
}

const BRANDS = Object.keys(BRAND_MAP).sort()

const PRODUCT_TYPES = ['shirt', 'blazer', 'suit', 'trousers', 'kurta', 'bundi', 'sherwani', 'indo-western']

const FIT_ISSUES = [
  'Sleeves too long', 'Sleeves too short', 'Waist too tight',
  'Tight on chest', 'Shoulder drops', 'Hip tight',
  'Too broad at shoulders', 'Upper back tight', 'Collar gap',
]

const BODY_SHAPES = [
  { id: 'lean', label: 'Lean / Slim', icon: '🏃' },
  { id: 'athletic', label: 'Athletic', icon: '💪' },
  { id: 'broad_chest', label: 'Broad Chest', icon: '🦁' },
  { id: 'belly', label: 'Belly / Rounded', icon: '🧔' },
  { id: 'broad_shoulders', label: 'Broad Shoulders', icon: '🏋' },
]

const SKIN_TONE_SCALES = [
  { id: 'light', color: '#F8E2CF', label: 'Light' },
  { id: 'wheatish', color: '#E8C19D', label: 'Wheatish' },
  { id: 'medium', color: '#D4A373', label: 'Medium' },
  { id: 'tan', color: '#B07D4F', label: 'Tan' },
  { id: 'dark', color: '#6B4226', label: 'Deep' },
]

const BRAND = '#a17a58'

/* ── Result computation ── */
function computeResult(brand: string, type: string, size: string, fit: string, issues: string[]) {
  const map = BRAND_MAP[brand]?.[type]
  const rawAsuka = map?.[size]

  if (!rawAsuka) {
    return { primary: '42', alternative: '44', confidence: 'Medium' as const, notes: 'Based on your brand and size inputs. Please confirm via our size chart.' }
  }

  let primary = parseInt(rawAsuka)
  const fitOffset = fit === 'Slim' ? 0 : fit === 'Relaxed' ? 2 : 0
  const chestIssue = issues.includes('Tight on chest')
  const waistIssue = issues.includes('Waist too tight')
  const hipIssue = issues.includes('Hip tight')

  if (chestIssue || waistIssue || hipIssue) primary += 2

  const alt = primary + 2

  const notesParts: string[] = []
  if (chestIssue) notesParts.push('chest may need ease')
  if (waistIssue) notesParts.push('waist suppression recommended')
  if (issues.includes('Sleeves too long')) notesParts.push('request sleeve shortening')
  if (issues.includes('Shoulder drops')) notesParts.push('shoulder structure requires attention')
  const notes = notesParts.length ? `${notesParts.join(', ')} — we recommend custom tailoring.` : 'Fit should be perfect for your build.'

  const confidence: 'High' | 'Medium' | 'Low' = map ? 'High' : 'Medium'

  return { primary: String(primary + fitOffset), alternative: String(alt + fitOffset), confidence, notes }
}

export default function SizingPage() {
  // STEP
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 state
  const [brand, setBrand] = useState('')
  const [productType, setProductType] = useState('')
  const [brandSize, setBrandSize] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [skinTone, setSkinTone] = useState('medium')
  const [fitPref, setFitPref] = useState('')
  const [bodyShape, setBodyShape] = useState('')
  const [issues, setIssues] = useState<string[]>([])
  const [freeText, setFreeText] = useState('')

  // Step 2 state
  const [photos, setPhotos] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  // Step 3 result
  const [result, setResult] = useState<{ primary: string, alternative: string, confidence: 'High' | 'Medium' | 'Low', notes: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleIssue = (issue: string) => {
    setIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue])
  }

  const handleStep1Next = () => {
    setStep(2)
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'brand_size', brand, product_type: productType, size: brandSize, height, weight, age,
          fit_preference: fitPref, body_shape: bodyShape, issues, free_text: freeText, skin_tone: skinTone
        })
      })
      const data = await res.json()
      setResult({
        primary: data.asuka_size,
        alternative: data.alternative,
        confidence: data.confidence as 'High' | 'Medium' | 'Low',
        notes: data.reasoning
      })
    } catch {
      setResult({ primary: 'MTO', alternative: 'Chat with Us', confidence: 'Medium', notes: 'Could not connect to the sizing engine. Please reach out to our team.' })
    }
    setLoading(false)
    setStep(3)
  }

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  const Section = ({ title, children }: any) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: BRAND, marginBottom: '12px' }}>{title}</div>
      {children}
    </div>
  )

  const Select = ({ value, onChange, placeholder, options }: any) => (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.15)', background: 'white', fontFamily: 'var(--font-sans)', fontSize: '14px', color: value ? 'var(--ink)' : '#999', outline: 'none', cursor: 'pointer' }}
    >
      <option value="">{placeholder}</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  )

  const Input = ({ placeholder, value, onChange, type = 'text' }: any) => (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(0,0,0,0.15)', background: 'white', fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none' }}
    />
  )

  return (
    <>
      <Header />
      <main style={{ background: '#fdf9f5', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* ── HERO ── */}
        <section style={{ background: 'var(--ink)', padding: '80px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(139,94,60,0.3) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '5px', color: BRAND, marginBottom: '20px', textTransform: 'uppercase' }}>AI-Powered</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,6vw,72px)', fontWeight: 300, color: 'white', letterSpacing: '3px', marginBottom: '20px' }}>
              AI Sizing <em style={{ fontStyle: 'italic', fontWeight: 200 }}>Finder</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.7)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
              Tell us your size in any brand you wear. Our AI maps it to your perfect Asuka size in seconds — with fit notes tailored to your body.
            </p>
          </div>
        </section>

        {/* ── PROGRESS BAR ── */}
        <div style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0' }}>
              {[
                { n: 1, label: 'Tell us what you wear' },
                { n: 2, label: 'Optional photos' },
                { n: 3, label: 'Your Asuka size' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: step >= s.n ? BRAND : '#e0d4c8',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                    transition: 'background 0.3s',
                  }}>{step > s.n ? '✓' : s.n}</div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: step >= s.n ? BRAND : '#aaa' }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{ height: '3px', background: '#f0e8dc', margin: '16px 0 0', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: BRAND, transition: 'width 0.5s ease', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* ── STEP CONTENT ── */}
        <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 48px' }}>

          {/* ══ STEP 1 ══ */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--ink)', marginBottom: '8px' }}>Step 1: Tell us what you wear</h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px', fontFamily: 'var(--font-sans)' }}>Even if you&apos;re unsure — just tell us what you normally reach for.</p>

              <div style={{ background: 'white', padding: '40px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 20px rgba(0,0,0,0.04)', marginBottom: '28px' }}>
                <Section title="Brand you usually wear">
                  <Select value={brand} onChange={setBrand} placeholder="Select a brand…" options={BRANDS} />
                </Section>

                <Section title="Product type">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {PRODUCT_TYPES.map(t => (
                      <button type="button" key={t} onClick={() => setProductType(t)} style={{
                        padding: '10px 20px', border: '1px solid rgba(0,0,0,0.15)',
                        background: productType === t ? BRAND : 'white',
                        color: productType === t ? 'white' : 'var(--ink)',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                      }}>{t}</button>
                    ))}
                  </div>
                </Section>

                <Section title="Your size in that brand">
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {brand && BRAND_MAP[brand]?.[productType]
                      ? Object.keys(BRAND_MAP[brand][productType]).map(s => (
                        <button type="button" key={s} onClick={() => setBrandSize(s)} style={{
                          padding: '10px 18px', border: '1px solid rgba(0,0,0,0.15)',
                          background: brandSize === s ? BRAND : 'white',
                          color: brandSize === s ? 'white' : 'var(--ink)',
                          fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                        }}>{s}</button>
                      ))
                      : (
                        <input value={brandSize} onChange={e => setBrandSize(e.target.value)}
                          placeholder="e.g. M, 40, 32, 15.5 collar…"
                          style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none' }}
                        />
                      )
                    }
                  </div>
                </Section>

                <Section title="Height, weight & age (optional)">
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Input placeholder="Height (e.g. 5'10)" value={height} onChange={setHeight} />
                    <Input placeholder="Weight (e.g. 78 kg)" value={weight} onChange={setWeight} />
                    <Input placeholder="Age range" value={age} onChange={setAge} />
                  </div>
                </Section>

                <Section title="Skin Tone">
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {SKIN_TONE_SCALES.map(s => (
                      <button type="button" key={s.id} onClick={() => setSkinTone(s.id)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'none', border: 'none'
                      }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%', background: s.color,
                          border: skinTone === s.id ? `3px solid ${BRAND}` : '1px solid rgba(0,0,0,0.1)',
                          boxShadow: skinTone === s.id ? '0 0 0 2px white inset' : 'none', transition: 'all 0.2s'
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: skinTone === s.id ? BRAND : '#999', textTransform: 'uppercase' }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Fit preference">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['Slim', 'Regular', 'Relaxed'].map(f => (
                      <button type="button" key={f} onClick={() => setFitPref(f)} style={{
                        flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.15)',
                        background: fitPref === f ? BRAND : 'white',
                        color: fitPref === f ? 'white' : 'var(--ink)',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s',
                      }}>{f}</button>
                    ))}
                  </div>
                </Section>

                <Section title="Body shape">
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {BODY_SHAPES.map(s => (
                      <button type="button" key={s.id} onClick={() => setBodyShape(s.id)} style={{
                        padding: '12px 20px', border: '1px solid rgba(0,0,0,0.15)',
                        background: bodyShape === s.id ? BRAND : 'white',
                        color: bodyShape === s.id ? 'white' : 'var(--ink)',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      }}>
                        <span style={{ fontSize: '22px' }}>{s.icon}</span>
                        <span style={{ letterSpacing: '0.5px' }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Issues I face (select all that apply)">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {FIT_ISSUES.map(issue => (
                      <label key={issue} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '10px 16px', border: `1px solid ${issues.includes(issue) ? BRAND : 'rgba(0,0,0,0.12)'}`,
                        background: issues.includes(issue) ? '#fdf3ec' : 'white',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s',
                      }}>
                        <input type="checkbox" checked={issues.includes(issue)} onChange={() => toggleIssue(issue)} style={{ accentColor: BRAND }} />
                        {issue}
                      </label>
                    ))}
                  </div>
                </Section>

                <Section title="Or just describe yourself (optional)">
                  <textarea
                    value={freeText} onChange={e => setFreeText(e.target.value)}
                    placeholder={`"I'm 5'10, 84kg, wear 42 in Louis Philippe, stomach area tight, prefer structured shoulder…"`}
                    rows={3}
                    style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.12)', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </Section>
              </div>

              <button
                onClick={handleStep1Next}
                disabled={!brand || !productType || !brandSize}
                style={{
                  width: '100%', padding: '18px', background: (!brand || !productType || !brandSize) ? '#ccc' : BRAND,
                  color: 'white', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px',
                  letterSpacing: '3px', textTransform: 'uppercase', cursor: (!brand || !productType || !brandSize) ? 'not-allowed' : 'pointer',
                }}
              >
                Next: Photos (Optional) →
              </button>
            </div>
          )}

          {/* ══ STEP 2 ══ */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--ink)', marginBottom: '8px' }}>Step 2: Upload photos (optional)</h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px', fontFamily: 'var(--font-sans)' }}>
                Not mandatory — but photos help our AI give a higher-confidence recommendation. <strong>No face required.</strong>
              </p>

              <div style={{ background: 'white', padding: '40px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  {[
                    { label: 'Front photo (fully clothed)', icon: '🧍' },
                    { label: 'Side photo (fully clothed)', icon: '🧍‍♂️' },
                    { label: 'Garment label photo', icon: '🏷' },
                    { label: 'Tape measure photo', icon: '📏' },
                  ].map((slot, i) => (
                    <div
                      key={slot.label}
                      onClick={() => fileRef.current?.click()}
                      style={{
                        border: '2px dashed rgba(0,0,0,0.15)', padding: '32px', textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.2s', background: photos[i] ? '#fdf3ec' : 'white',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = BRAND}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'}
                    >
                      <div style={{ fontSize: '36px', marginBottom: '12px' }}>{slot.icon}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: photos[i] ? BRAND : '#999' }}>
                        {photos[i] ? `✓ ${photos[i].name}` : slot.label}
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  ref={fileRef} type="file" accept="image/*" multiple
                  style={{ display: 'none' }}
                  onChange={e => setPhotos(Array.from(e.target.files || []))}
                />

                {/* Disclaimer */}
                <div style={{ background: '#fdf9f5', border: '1px solid rgba(139,94,60,0.2)', padding: '16px 20px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888', lineHeight: 1.8 }}>
                  ⚠️ <strong>Note:</strong> Based on your inputs + optional photos, our AI will estimate your best Asuka size. Photos are used only to infer body proportions — no facial data is processed. This is a recommendation, not a guarantee.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', border: '1px solid rgba(0,0,0,0.15)', background: 'white', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>← Back</button>
                <button type="button" onClick={handleFinish} disabled={loading} style={{ flex: 3, padding: '16px', background: loading ? '#ccc' : BRAND, color: 'white', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Analyzing...' : 'Get My Asuka Size →'}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: RESULT ══ */}
          {step === 3 && result && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--ink)', marginBottom: '8px' }}>Your Asuka Size</h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px', fontFamily: 'var(--font-sans)' }}>Based on your {brand} {brandSize} {productType} and your body inputs.</p>

              {/* Main result card */}
              <div style={{ background: 'white', border: '2px solid ' + BRAND, padding: '48px', marginBottom: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: BRAND }} />

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: BRAND, marginBottom: '16px' }}>Your Best Match</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '80px', fontWeight: 300, color: 'var(--ink)', lineHeight: 1, marginBottom: '8px' }}>{result.primary}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#888', marginBottom: '32px' }}>Asuka Size — {fitPref || 'Regular'} Fit</div>

                {/* Alt size */}
                <div style={{ display: 'inline-block', padding: '10px 24px', border: '1px solid rgba(0,0,0,0.12)', marginBottom: '32px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#888' }}>Alternative: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{result.alternative}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888' }}> — if you prefer comfort</span>
                </div>

                {/* Fit notes */}
                <div style={{ background: '#fdf9f5', padding: '20px', marginBottom: '32px', textAlign: 'left', borderLeft: `3px solid ${BRAND}` }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: BRAND, marginBottom: '8px' }}>Fit Notes</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#555', lineHeight: 1.8 }}>
                    {issues.length > 0 && <span>Based on your noted issues: <strong>{issues.join(', ')}</strong>. </span>}{result.notes}
                  </div>
                </div>

                {/* Confidence meter */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Confidence Level</div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {(['Low', 'Medium', 'High'] as const).map(level => (
                      <div key={level} style={{
                        padding: '6px 20px',
                        background: result.confidence === level ? BRAND : '#f0e8dc',
                        color: result.confidence === level ? 'white' : '#aaa',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: result.confidence === level ? 700 : 400,
                        transition: 'all 0.3s',
                      }}>{level}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link href="/collections/ethnic-wear-for-men" style={{
                  display: 'block', padding: '18px', background: BRAND, color: 'white', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                }}>
                  Shop Size {result.primary}
                </Link>
                <a href="https://wa.me/919810021030?text=Hi+Asuka%2C+I+need+help+with+sizing+for+a+specific+product" target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', padding: '18px', background: '#25D366', color: 'white', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                }}>
                  💬 3-min sizing chat
                </a>
                <Link href="/pages/book-an-appointment" style={{
                  display: 'block', padding: '18px', border: '1px solid ' + BRAND, color: BRAND, textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                }}>
                  Get Custom Made (MTO)
                </Link>
              </div>

              <button type="button" onClick={() => { setStep(1); setBrand(''); setProductType(''); setBrandSize(''); setIssues([]); setFitPref(''); setBodyShape(''); setPhotos([]) }}
                style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.12)', background: 'white', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                ← Start Over
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
