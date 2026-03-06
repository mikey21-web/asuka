'use client'

import { useState } from 'react'

const BRANDS = ['Zara', 'H&M', 'Mango', 'Raymond', 'Peter England', 'Allen Solly', 'Van Heusen', 'Louis Philippe', 'Arrow', 'Blackberrys', 'Zodiac', 'Jack & Jones', 'Other']
const FIT_PREFS = ['Slim Tailored', 'Regular/Classic', 'Relaxed']
const BODY_SHAPES = ['Athletic', 'Lean', 'Broad Chest', 'Belly', 'Broad Shoulders']
const ISSUES_LIST = ['Sleeves too long', 'Waist too tight', 'Tight on chest', 'Shoulder drops', 'Hip tight']
const PRODUCT_TYPES = ['Shirt', 'Trousers', 'Suit', 'Blazer', 'Kurta', 'Bundi', 'Sherwani']

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
  const [result, setResult] = useState<any>(null)

  if (!isOpen) return null

  async function runSizer() {
    setLoading(true)
    try {
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
          issues,
          height,
          weight
        }),
      })
      const data = await res.json()
      setResult(data)
      setStep(3)
    } catch {
      setResult({ asuka_size: '40', alternative: '42', confidence: 'Medium', reasoning: 'Based on your inputs, we recommend taking a standard size and speaking to a tailor.' })
      setStep(3)
    }
    setLoading(false)
  }

  const InputStyle = { width: '100%', background: '#fff', border: '1px solid #d4c4b0', color: '#1a1410', fontFamily: 'var(--font-sans)', fontSize: '14px', padding: '12px', outline: 'none', marginBottom: '16px', borderRadius: '4px' }
  const LabelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: '#a17a58', textTransform: 'uppercase' as const, marginBottom: '6px' }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#fffdfd] w-full max-w-lg rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8e0d6] shrink-0">
          <div>
            <h2 className="text-2xl font-serif text-[#1a1410]">AI Fit Finder</h2>
            <p className="text-xs font-mono text-[#a17a58] tracking-widest uppercase mt-1">Discover your perfect Asuka size</p>
          </div>
          <button onClick={onClose} className="text-[#1a1410] hover:text-[#a17a58] transition-colors p-2">
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
                  <select style={{ ...InputStyle, cursor: 'pointer', appearance: 'none' }} value={pt} onChange={e => setPt(e.target.value)}>
                    {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LabelStyle}>Brand</label>
                  <select style={{ ...InputStyle, cursor: 'pointer', appearance: 'none' }} value={brand} onChange={e => setBrand(e.target.value)}>
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
                <input style={InputStyle} value={size} onChange={e => setSize(e.target.value)} placeholder="e.g., M, 40, 32, 15.5 collar" />
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
                  className="w-full py-4 bg-[#1a1410] text-white font-mono text-[11px] tracking-[3px] uppercase disabled:opacity-50 hover:bg-[#a17a58] transition-colors"
                >
                  Next: Fit & Shape →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp flex flex-col gap-2">
              <h3 className="font-serif text-lg text-[#1a1410] mb-4">Step 2: Fit Profile</h3>

              <label style={LabelStyle}>Fit Preference</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {FIT_PREFS.map(f => (
                  <button
                    key={f} onClick={() => setFit(f)}
                    className={`flex-1 min-w-[100px] py-3 text-[10px] font-mono uppercase bg-transparent border ${fit === f ? 'bg-[#a17a58] border-[#a17a58] text-white' : 'border-[#d4c4b0] text-[#a17a58]'} rounded-sm transition-colors`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <label style={LabelStyle}>Body Shape</label>
              <select style={{ ...InputStyle, padding: '10px 12px', cursor: 'pointer', appearance: 'none' }} value={shape} onChange={e => setShape(e.target.value)}>
                {BODY_SHAPES.map(s => <option key={s}>{s}</option>)}
              </select>

              <label style={{ ...LabelStyle, marginTop: '8px' }}>Issues I face (Optional)</label>
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

              <div className="p-4 border border-dashed border-[#a17a58] bg-[#faf7f2] rounded text-center mb-6">
                <p className="text-[11px] font-mono tracking-wide text-[#a17a58] uppercase mb-2">Upload References (Optional)</p>
                <p className="text-xs text-[#666] mb-3">Upload 2-3 photos (front + side) or measurement tape pics.</p>
                <button className="px-4 py-2 border border-[#a17a58] text-[#a17a58] text-[10px] font-mono uppercase bg-white hover:bg-[#a17a58] hover:text-white transition-colors cursor-pointer">
                  Choose Images
                </button>
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
                  className="flex-[2] py-4 bg-[#1a1410] text-white font-mono text-[11px] tracking-[3px] uppercase disabled:opacity-70 flex items-center justify-center cursor-pointer border-none"
                >
                  {loading ? <span className="animate-pulse">Analyzing...</span> : 'Get Recommendation'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="animate-fadeUp flex flex-col items-center">
              <div className="p-8 bg-[#faf7f2] border border-[#e8e0d6] rounded-lg w-full text-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a17a58] to-[#1a1410]"></div>
                <h4 className="font-mono text-[10px] tracking-[3px] text-[#a17a58] uppercase mb-2">Your Best Match</h4>
                <div className="text-6xl font-serif text-[#1a1410] mb-2">{result.asuka_size || result.size}</div>
                <div className="text-sm font-sans text-[#555] mt-4 pt-4 border-t border-[#e8e0d6] inline-block">
                  Alternative: <span className="font-bold">{result.alternative}</span>
                </div>
              </div>

              <div className="w-full mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666]">Fit Confidence</span>
                  <span className="font-mono text-[11px] font-bold text-[#1a1410]">{result.confidence}</span>
                </div>
                <div className="w-full h-2 bg-[#e8e0d6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a17a58] transition-all duration-1000"
                    style={{ width: result.confidence === 'High' ? '92%' : result.confidence === 'Medium' ? '70%' : '50%' }}
                  ></div>
                </div>
              </div>

              <div className="w-full bg-white border border-[#e8e0d6] p-4 rounded mb-6 text-sm text-[#444] leading-relaxed relative">
                <span className="absolute -top-3 left-4 bg-white px-2 font-mono text-[9px] uppercase tracking-widest text-[#a17a58]">AI Fit Notes</span>
                {result.reasoning}
              </div>

              <div className="w-full flex flex-col gap-3">
                <button onClick={onClose} className="w-full py-4 bg-[#1a1410] border-none text-white font-mono text-[11px] tracking-[3px] uppercase hover:bg-[#a17a58] transition-colors cursor-pointer">
                  Shop Recommended Size
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href="#" className="py-3 border border-[#25D366] text-[#25D366] font-mono text-[9px] tracking-[1px] uppercase flex items-center justify-center gap-2 hover:bg-[#f0fdf4] no-underline cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.939-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                    Book Chat
                  </a>
                  <a href="/make-it-yourself" className="py-3 border border-[#1a1410] bg-transparent text-[#1a1410] font-mono text-[9px] tracking-[1px] uppercase flex items-center justify-center hover:bg-gray-50 text-center no-underline cursor-pointer">
                    Get Custom MTO
                  </a>
                </div>
              </div>
              <button disabled={loading} onClick={() => { setStep(1); setResult(null) }} className="mt-4 text-[10px] bg-transparent border-none font-mono tracking-widest text-[#a17a58] uppercase underline underline-offset-4 cursor-pointer">
                Calculate Another Size
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
