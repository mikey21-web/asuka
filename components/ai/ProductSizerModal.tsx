'use client'

import { useEffect, useState } from 'react'
import VoiceInput from './VoiceInput'

const BRANDS = ['Zara', 'H&M', 'Mango', 'Raymond', 'Peter England', 'Allen Solly', 'Van Heusen', 'Louis Philippe', 'Arrow', 'Blackberrys', 'Zodiac', 'Jack & Jones', 'Other']
const FIT_PREFS = ['Slim Tailored', 'Regular/Classic', 'Relaxed']
const BODY_SHAPES = ['Athletic', 'Lean', 'Broad Chest', 'Belly', 'Broad Shoulders']
const ISSUES_LIST = ['Sleeves too long', 'Waist too tight', 'Tight on chest', 'Shoulder drops', 'Hip tight']
const PRODUCT_TYPES = ['Shirt', 'Trousers', 'Suit', 'Blazer', 'Kurta', 'Bundi', 'Sherwani']
const BASE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44']

interface SizerResult {
  asuka_size?: string
  size?: string
  alternative?: string
  confidence?: string
  reasoning?: string
}

export default function ProductSizerModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [brand, setBrand] = useState('Zara')
  const [otherBrand, setOtherBrand] = useState('')
  const [pt, setPt] = useState('Shirt')
  const [size, setSize] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [fit, setFit] = useState('Regular/Classic')
  const [shape, setShape] = useState('Athletic')
  const [issues, setIssues] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SizerResult | null>(null)
  const [customSize, setCustomSize] = useState('')

  /* State for photos */
  const [photos, setPhotos] = useState<(File | null)[]>([null, null])
  const [previewUrls, setPreviewUrls] = useState<string[]>(['', ''])

  useEffect(() => {
    const next = photos.map((file) => (file ? URL.createObjectURL(file) : ''))
    setPreviewUrls(next)
    return () => {
      next.forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [photos])

  if (!isOpen) return null

  async function runSizer() {
    setLoading(true)
    try {
      const photoData: string[] = [];
      for (const file of photos) {
        if (file) {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          photoData.push(base64);
        }
      }

      const res = await fetch('/api/sizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'brand_size',
          brand: brand === 'Other' ? otherBrand : brand,
          size,
          product_type: pt,
          fit_preference: fit,
          body_shape: shape,
          issues: issues,
          height,
          weight,
          photos: photoData
        }),
      })
      const data = await res.json()
      setResult(data)
      setStep(3)
    } catch (err) {
      console.error('Sizer error:', err)
      setResult({ size: '40', alternative: '42', confidence: 'Medium', reasoning: 'Based on your inputs, we recommend taking a standard size and speaking to a tailor.' })
      setStep(3)
    }
    setLoading(false)
  }

  const InputStyle = { width: '100%', background: '#fff', border: '1px solid var(--gold-border)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: '14px', padding: '12px', outline: 'none', marginBottom: '16px', borderRadius: '4px', WebkitAppearance: 'none' as const, MozAppearance: 'none' as const }
  const LabelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase' as const, marginBottom: '6px' }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#fffdfd] w-full max-w-lg rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--gold-border)] shrink-0">
          <div>
            <h2 className="text-2xl font-serif text-[var(--ink)]">AI Fit Finder</h2>
            <p className="text-xs font-mono text-[var(--gold)] tracking-widest uppercase mt-1">Discover your perfect Asuka size</p>
          </div>
          <button onClick={onClose} className="text-[var(--ink)] hover:text-[var(--gold)] transition-colors p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">

          {step === 1 && (
            <div className="animate-fadeUp flex flex-col gap-2">
              <h3 className="font-serif text-lg text-[#1a1410] mb-4">Step 1: Tell us what you wear</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={LabelStyle}>Product Type</label>
                  <select style={{ ...InputStyle, cursor: 'pointer' }} value={pt} onChange={e => setPt(e.target.value)}>
                    {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LabelStyle}>Brand</label>
                  <select style={{ ...InputStyle, cursor: 'pointer' }} value={brand} onChange={e => setBrand(e.target.value)}>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {brand === 'Other' && (
                <div>
                  <label style={LabelStyle}>Enter Brand</label>
                  <input style={InputStyle} value={otherBrand} onChange={e => setOtherBrand(e.target.value)} placeholder="E.g. Gucci" />
                </div>
              )}

              <div>
                <label style={LabelStyle}>Size in that brand</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center mb-2">
                  <select style={{ ...InputStyle, marginBottom: 0, cursor: 'pointer' }} value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">Select base size</option>
                    {BASE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    style={{ ...InputStyle, marginBottom: 0 }}
                    value={customSize}
                    onChange={e => {
                      setCustomSize(e.target.value)
                      setSize(e.target.value)
                    }}
                    placeholder="Or custom (15.5 collar)"
                  />
                </div>
                <div className="flex gap-2 items-center mb-4">
                  <VoiceInput onTranscription={setSize} isChatLoading={loading} />
                  <span className="text-[10px] text-[#777]">Voice works too</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={LabelStyle}>Height (Optional)</label>
                  <input style={InputStyle} value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 5'10" />
                </div>
                <div>
                  <label style={LabelStyle}>Weight (Optional)</label>
                  <input style={InputStyle} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75kg" />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!size}
                  className="w-full py-4 bg-[var(--ink)] text-white font-mono text-[11px] tracking-[3px] uppercase disabled:opacity-50 hover:bg-[var(--gold)] transition-colors"
                >
                  Next: Fit & Shape →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp flex flex-col gap-2">
              <h3 className="font-serif text-lg text-[#1a1410] mb-4">Step 2: Fit & Visual Profile</h3>

              <label style={LabelStyle}>Fit Preference</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {FIT_PREFS.map(f => (
                  <button
                    key={f} onClick={() => setFit(f)}
                    className={`flex-1 min-w-[100px] py-3 text-[10px] font-mono uppercase border rounded-sm transition-colors cursor-pointer ${fit === f ? 'bg-[var(--gold)] border-[var(--gold)] text-white font-bold' : 'bg-white border-[var(--gold-border)] text-[var(--ink)] hover:border-[var(--gold)]'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                <label style={LabelStyle}>Body Shape</label>
                <select style={{ ...InputStyle, padding: '10px 12px', cursor: 'pointer', color: '#1a1410', backgroundColor: '#fff' }} value={shape} onChange={e => setShape(e.target.value)}>
                  {BODY_SHAPES.map(s => <option key={s}>{s}</option>)}
                </select>

                <label style={LabelStyle}>Issues I face (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {ISSUES_LIST.map(issue => (
                    <label key={issue} className="flex items-center gap-2 text-xs text-[#555] cursor-pointer bg-transparent">
                      <input
                        type="checkbox"
                        className="accent-[#a17a58] w-4 h-4 bg-transparent"
                        checked={issues.includes(issue)}
                        onChange={e => e.target.checked ? setIssues([...issues, issue]) : setIssues(issues.filter(i => i !== issue))}
                      />
                      {issue}
                    </label>
                  ))}
                </div>

                <label style={LabelStyle}>Upload Photos (Recommended)</label>
                <p style={{ fontSize: '10px', color: '#999', marginBottom: '12px' }}>Photos help our AI analyze your build for a more precise match.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {['Front View', 'Side View'].map((label, i) => (
                    <div
                      key={label}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement
                          const file = target.files?.[0]
                          if (file) {
                            const newPhotos = [...photos];
                            newPhotos[i] = file;
                            setPhotos(newPhotos);
                          }
                        };
                        input.click();
                      }}
                      style={{
                        border: '1px dashed var(--gold-border)',
                        padding: '16px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: photos[i] ? 'var(--gold-dim)' : 'var(--paper)',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {photos[i] ? (
                        <>
                          <img
                            src={previewUrls[i]}
                            alt="preview"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                          />
                          <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '2px' }}>
                            <div style={{ fontSize: '16px' }}>✓</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: '#a17a58' }}>ATTACHED</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>{i === 0 ? '🧍' : '🧍‍♂️'}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: '#a17a58', textTransform: 'uppercase' }}>
                            {label}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>




              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-[#1a1410] bg-transparent text-[#1a1410] font-mono text-[11px] tracking-[3px] uppercase cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={runSizer}
                  disabled={loading}
                  className="flex-[2] py-4 bg-[var(--ink)] text-white font-mono text-[11px] tracking-[3px] uppercase disabled:opacity-70 flex items-center justify-center cursor-pointer border-none"
                >
                  {loading ? <span className="animate-pulse">Analyzing...</span> : 'Get Recommendation'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="animate-fadeUp flex flex-col items-center justify-center py-8">
              <div className="text-center mb-10">
                <h4 className="font-mono text-[11px] tracking-[4px] text-[var(--gold)] uppercase mb-4">Recommended Size</h4>
                <div className="text-[140px] font-serif text-[var(--ink)] leading-none mb-6">
                  {result.asuka_size || result.size}
                </div>
                {result.alternative && (
                  <div className="font-mono text-xs text-[#888] tracking-widest">
                    PROBABLE SECOND: <span className="text-[var(--ink)] font-bold">{result.alternative}</span>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-3">
                <button onClick={onClose} className="w-full py-4 bg-[var(--ink)] border-none text-white font-mono text-[11px] tracking-[3px] uppercase hover:bg-[var(--gold)] transition-colors cursor-pointer">
                  Shop this Size →
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`https://wa.me/919063356542?text=${encodeURIComponent("I've been sized as " + (result.asuka_size || result.size) + " by the AI. Can we discuss?")}`} target="_blank" rel="noopener noreferrer" className="py-3 border border-[#25D366] text-[#25D366] font-mono text-[9px] tracking-[1px] uppercase flex items-center justify-center gap-2 hover:bg-[#f0fdf4] no-underline cursor-pointer">
                    WhatsApp Tailor
                  </a>
                  <button onClick={() => { setStep(1); setResult(null) }} className="py-3 border border-[#1a1410] bg-transparent text-[#1a1410] font-mono text-[9px] tracking-[1px] uppercase flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                    Re-Calculate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
