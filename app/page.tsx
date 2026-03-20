'use client'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard' // Added this import
import { HERO_ETHNIC, HERO_WESTERN, STORES, BRAND_SLIDER_IMAGES } from '@/lib/site-data'
import { getCelebrityProducts } from '@/lib/catalog'
import DigitalStylistSection from '@/components/sections/DigitalStylist'

/* ── Preload celebrity products at module level ── */
export default function Home() {
  const celebrities = getCelebrityProducts()

  return (
    <>
      <Header />
      <main style={{ background: 'white', minHeight: '100vh' }}>

        {/* ═══ 1. AI-FIRST HERO ═══ */}
        <section className="relative overflow-hidden bg-[#0e0b09] text-white">
          <div className="absolute inset-0 opacity-40" style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(161,122,88,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(201,168,76,0.22), transparent 36%)'
          }} />
          <div className="relative max-w-[1240px] mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <p className="font-mono text-[10px] tracking-[4px] uppercase text-[#d7be9b] mb-5">Asuka AI Stylist</p>
              <h1 className="font-serif text-[38px] leading-[1.05] md:text-[64px] max-w-[760px] mb-6">
                Dress Like It Was
                <em className="font-normal text-[#d9ba91]"> Tailored For Tonight</em>
              </h1>
              <p className="font-sans text-[#ddd0c3] text-[16px] leading-relaxed max-w-[620px] mb-9">
                Meet Ayaan, your personal couture stylist. Tell us your occasion, fit, and mood; get curated looks, live size guidance, and a direct handover to our atelier.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/ai-stylist" className="inline-flex items-center justify-center px-9 py-4 bg-[#a17a58] text-white no-underline font-mono text-[11px] tracking-[3px] uppercase hover:bg-[#b98a67] transition-colors">
                  Launch AI Stylist
                </Link>
                <Link href="/make-it-yourself" className="inline-flex items-center justify-center px-9 py-4 border border-[#7e6854] text-[#e8dac7] no-underline font-mono text-[11px] tracking-[3px] uppercase hover:border-[#a17a58] hover:text-white transition-colors">
                  Open MIY Atelier
                </Link>
              </div>
            </div>
            <div className="border border-[#3c3027] bg-[#17120f] p-6 md:p-8 rounded-sm shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#b69878] mb-4">Live Flow</p>
              <ol className="space-y-3 text-[14px] text-[#e5d7c6]">
                <li>1. Share event, city, and style vibe</li>
                <li>2. Get tailored looks from the synced catalog</li>
                <li>3. Use AI sizing with easy fit inputs and optional photos</li>
                <li>4. Move to WhatsApp with a ready brief</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ═══ 2. SPLIT HERO COLLECTION ENTRY ═══ */}
        <section className="relative w-full flex flex-col md:flex-row overflow-hidden bg-black gap-0">
          {/* LEFT: ETHNIC WEAR */}
          <Link href="/ethnic-home" className="relative flex-1 group overflow-hidden block w-full min-h-[80vh] md:h-screen">
            <Image
              src={HERO_ETHNIC}
              alt="Ethnic Wear"
              fill
              className="object-cover object-[center_20%] transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              priority
            />
            {/* Top Logo */}
            <div className="absolute top-[40px] md:top-[60px] w-full flex justify-center z-10">
              <Image 
                src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" 
                alt="Asuka Logo" 
                width={160} 
                height={60} 
                className="w-[100px] md:w-[160px] brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
            {/* Minimal gradient for text contrast only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
          </Link>

          {/* RIGHT: WESTERN WEAR */}
          <Link href="/western-home" className="relative flex-1 group overflow-hidden block w-full min-h-[80vh] md:h-screen md:border-l-[0.5px] md:border-white/20">
            <Image
              src={HERO_WESTERN}
              alt="Western Wear"
              fill
              className="object-cover object-[center_30%] transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              priority
            />
            {/* Top Logo */}
            <div className="absolute top-[40px] md:top-[60px] w-full flex justify-center z-10">
              <Image 
              src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" 
              alt="Asuka Logo" 
              width={160} 
              height={60} 
              className="w-[100px] md:w-[160px] brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              priority
            />
            </div>
            {/* Minimal gradient for text contrast only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
          </Link>
        </section>

        {/* ═══ 2.5 DIGITAL ATELIER (AI Integration) ═══ */}
        <DigitalStylistSection />

        {/* ═══ 3. SPOTTED IN ASUKA — Celebrity grid ═══ */}
        <section className="py-[60px] md:py-[80px]">
          <div className="page-width max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="text-center mb-10">
              <h2 className="font-serif text-[28px] md:text-[36px] font-normal text-[#1a1410] tracking-[2px] uppercase m-0">Spotted in asuka</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map(c => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/collections/celebrity-styles" className="inline-block px-10 py-3.5 border border-[#1a1410] font-sans text-[13px] tracking-[2px] uppercase text-[#1a1410] no-underline transition-colors hover:bg-[#1a1410] hover:text-white">
                View all
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 3. BRAND SLIDER (Swiper-like auto scroll) ═══ */}
        <section className="py-[60px] md:py-[80px] bg-[#FAF6F1] overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[28px] md:text-[36px] font-normal text-[#1a1410] tracking-[2px] uppercase m-0">The Brand in Press</h2>
          </div>
          <div className="relative w-full overflow-hidden flex">
            <div className="flex shrink-0 animate-marquee gap-4 px-4 whitespace-nowrap min-w-max">
              {[...BRAND_SLIDER_IMAGES, ...BRAND_SLIDER_IMAGES].map((src, i) => (
                <div key={i} className="relative w-[280px] h-[380px] shrink-0 border border-[#e8e0d6] shadow-sm">
                  <img src={src} alt="brand press" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee { animation: marquee 30s linear infinite; }
            .animate-marquee:hover { animation-play-state: paused; }
          `}</style>
        </section>

        {/* ═══ 4. STORE LOCATOR ═══ */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>STORE LOCATOR</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {STORES.map(s => (
                <div key={s.city} className="text-center">
                  <a href={s.map} target="_blank" rel="noopener noreferrer">
                    <div className="overflow-hidden mb-4">
                      <img src={s.img} alt={s.city} className="w-full h-auto block" />
                    </div>
                  </a>
                  <h3 className="font-sans text-[21px] font-normal text-[#1a1410] lowercase mb-2">{s.city}</h3>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-1">{s.address}</p>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-4">{s.hours}</p>
                  <a href={s.map} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 border border-[#1a1410] font-sans text-[12px] font-normal tracking-[2px] lowercase text-[#1a1410] no-underline">get directions</a>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/book-an-appointment" style={{
                display: 'inline-block', padding: '14px 40px', border: '1px solid #1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none',
              }}>BOOK AN APPOINTMENT</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
