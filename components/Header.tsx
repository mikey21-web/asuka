'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ETHNIC_NAV = [
  { name: 'BANDHGALA', href: '/collections/bandhgala-suit-for-men' },
  { name: 'INDO-WESTERN', href: '/collections/indowestern-for-men' },
  { name: 'KURTA BUNDI SET', href: '/collections/kurta-bundi-set-for-men' },
  { name: 'KURTA SET', href: '/collections/kurta-set-for-men' },
  { name: 'SHERWANI', href: '/collections/sherwani' },
]

const WESTERN_NAV = [
  { name: 'SHIRTS', href: '/collections/buy-shirts-for-men' },
  { name: 'CO-ORD SETS', href: '/collections/co-ord-sets-for-men' },
  { name: 'TUXEDO SETS', href: '/collections/buy-tuxedo-suit-for-wedding' },
  { name: 'FORMAL SUITS', href: '/collections/suit-set-for-men' },
  { name: 'JACKETS', href: '/collections/jackets-for-men' },
  { name: 'CASUAL SUITS', href: '/collections/casual-suits-for-men' },
]

const ACCESSORIES_ITEMS = [
  { name: 'Embroidered Shoes', href: '/collections/embroidered-shoes-for-men' },
  { name: 'Embroidered Stoles', href: '/collections/embroidered-stoles' },
]

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAcc, setShowAcc] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHome = pathname === '/'
  const isWestern = pathname?.includes('western') || pathname?.includes('shirts') || pathname?.includes('tuxedo') || pathname?.includes('jackets') || pathname?.includes('casual-suits') || pathname?.includes('co-ord') || pathname?.includes('suit-set')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const ANNOUNCEMENTS = [
    'HYDERABAD \u00a0|\u00a0 MUMBAI \u00a0|\u00a0 AHMEDABAD',
    'FREE SHIPPING ON ORDERS ABOVE ₹15,000',
    'NEW ARRIVALS — WEDDING COLLECTION 2025',
    'BOOK A PERSONAL STYLING SESSION TODAY',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx(i => (i + 1) % ANNOUNCEMENTS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [ANNOUNCEMENTS.length])

  /* ══ HOMEPAGE — transparent floating header, overlays hero ══ */
  if (isHome) {
    return (
      <>
        {/* Brown announcement bar — rotates messages */}
        <div className="bg-[#a17a58] text-white text-center relative z-[1002] py-2.5 overflow-hidden h-[36px]">
          <div key={announcementIdx} className="font-mono text-[11px] tracking-[3px] font-medium text-white animate-fadeUp">
            {ANNOUNCEMENTS[announcementIdx]}
          </div>
        </div>

        {/* Minimal floating header — matches original asukacouture.com homepage */}
        <header
          className={`${isScrolled ? 'fixed top-0 bg-[#1a1410]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'absolute top-[41px] bg-transparent'} left-0 right-0 z-[1001] h-14 transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 h-full max-w-[1800px] mx-auto w-full">

            {/* LEFT: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(true)} className="bg-transparent border-none text-white p-1 cursor-pointer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              <Link href="/" className="flex items-center gap-2 no-underline">
                <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412"
                  alt="Asuka" className="h-6 brightness-0 invert" />
                <span className="font-serif text-white text-lg tracking-[4px] uppercase font-light hidden sm:inline">ASUKĀ</span>
              </Link>
            </div>

            {/* CENTER: Desktop nav links          {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 flex-1 ml-10">
              <Link href="/ethnic-home" className={`text-sm tracking-widest no-underline transition-colors ${isWestern ? 'text-white/80 hover:text-white' : 'text-[#1a1410]/70 hover:text-[#1a1410]'}`}>ETHNIC</Link>
              <Link href="/western-home" className={`text-sm tracking-widest no-underline transition-colors ${isWestern ? 'text-white/80 hover:text-white' : 'text-[#1a1410]/70 hover:text-[#1a1410]'}`}>WESTERN</Link>
              <Link href="/collections/celebrity-styles" className={`text-sm tracking-widest no-underline transition-colors ${isWestern ? 'text-white/80 hover:text-white' : 'text-[#1a1410]/70 hover:text-[#1a1410]'}`}>CELEBRITIES</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'style' } })) }} className="text-sm tracking-widest no-underline transition-colors text-[#a17a58] hover:text-[#1a1410] font-semibold">AI STYLIST</a>
            </nav>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3">
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'make' } })) }} className="hidden md:inline font-mono text-[9px] tracking-[1.5px] text-white no-underline opacity-80 hover:opacity-100 whitespace-nowrap">MAKE IT YOURSELF</a>
              <Link href="/sizing" className="hidden md:inline bg-white text-[#a17a58] px-3 py-1.5 text-[9px] font-mono tracking-[1.5px] no-underline font-bold whitespace-nowrap hover:bg-[#a17a58] hover:text-white transition-colors">AI SIZER</Link>
              <Link href="/search" className="text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
              </Link>
              <button type="button" className="bg-transparent border-none text-white p-1 cursor-pointer hidden sm:block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE OVERLAY MENU */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-[2000] overflow-y-auto">
            <div className="flex justify-end p-5">
              <button onClick={() => setIsMenuOpen(false)} className="bg-transparent border-none text-[#1a1410] cursor-pointer">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-8 pb-10">
              <div className="flex flex-col gap-8">
                <Link href="/ethnic-home" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif no-underline text-[#1a1410] tracking-wider">ETHNIC WEAR</Link>
                <Link href="/western-home" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif no-underline text-[#1a1410] tracking-wider">WESTERN WEAR</Link>
                <Link href="/collections/celebrity-styles" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif no-underline text-[#1a1410] tracking-wider">CELEBRITY STYLES</Link>

                <hr className="border-none border-t border-[#eee]" />

                <div className="flex flex-col gap-4">
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'make' } })) }} className="text-sm font-mono no-underline text-[#a17a58]">MAKE IT YOURSELF</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'style' } })) }} className="text-sm font-mono no-underline text-[#1a1410]">AI STYLIST</a>
                  <Link href="/sizing" onClick={() => setIsMenuOpen(false)} className="text-sm font-mono no-underline text-[#1a1410]">AI SIZER</Link>
                  <Link href="/store-locator" onClick={() => setIsMenuOpen(false)} className="text-sm font-mono no-underline text-[#1a1410]">STORE LOCATOR</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  /* ══ INNER PAGES — White sticky header ══ */
  return (
    <>
      {/* Ethnic / Western switcher bar */}
      <div style={{ display: 'flex', zIndex: 1002, position: 'relative' }}>
        <Link href="/ethnic-home"
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: isWestern ? '#609696' : '#1a1410', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          Ethnic Wear
        </Link>
        <Link href="/western-home"
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: isWestern ? '#609696' : '#1a1410' }}>
          Western Wear
        </Link>
      </div>

      {/* Sticky header — teal on western pages, white on ethnic */}
      <header
        style={{ transition: 'box-shadow 0.3s' }}
        className={`sticky top-0 z-[1001] ${isWestern ? 'bg-[#609696] border-none' : 'bg-white border-b border-[#eee]'} ${isScrolled ? 'shadow-md shadow-black/5' : 'shadow-none'}`}
      >
        <div className="flex items-center justify-between px-5 h-16 max-w-[1600px] mx-auto">
          {/* MOBILE ONLY: Hamburger */}
          <button onClick={() => setIsMenuOpen(true)} className={`md:hidden bg-transparent border-none cursor-pointer p-1 ${isWestern ? 'text-white' : 'text-[#1a1410]'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" alt="Asuka" style={{ height: '28px' }} className={isWestern ? 'brightness-0 invert' : ''} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', letterSpacing: '5px', fontWeight: 300, textTransform: 'uppercase' }} className={`hidden sm:inline ${isWestern ? 'text-white' : 'text-[#a17a58]'}`}>ASUKĀ</span>
          </Link>

          {/* Sub-nav (Desktop only) */}
          <nav style={{ gap: '24px', alignItems: 'center' }} className="hidden lg:flex">
            {(isWestern ? WESTERN_NAV : ETHNIC_NAV).map(link => (
              <Link key={link.name} href={link.href} style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: isWestern ? 'white' : '#1a1410', textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = isWestern ? 'rgba(255,255,255,0.7)' : '#a17a58'}
                onMouseLeave={e => e.currentTarget.style.color = isWestern ? 'white' : '#1a1410'}>
                {link.name}
              </Link>
            ))}

            {/* Accessories dropdown */}
            <div onMouseEnter={() => setShowAcc(true)} onMouseLeave={() => setShowAcc(false)} style={{ position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1a1410', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a17a58'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#1a1410'}>
                ACCESSORIES <span style={{ fontSize: '8px' }}>▾</span>
              </span>
              {showAcc && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, background: 'white',
                  border: '1px solid #eee', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  padding: '8px 0', minWidth: '200px', zIndex: 1002, marginTop: '8px',
                }}>
                  {ACCESSORIES_ITEMS.map(item => (
                    <Link key={item.name} href={item.href} style={{
                      display: 'block', padding: '12px 20px', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'make' } })) }} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: isWestern ? 'white' : '#a17a58', textDecoration: 'none', whiteSpace: 'nowrap' }} className="hidden sm:inline">MAKE IT YOURSELF</a>
            <Link href="/sizing" style={{ background: isWestern ? 'white' : '#a17a58', color: isWestern ? '#609696' : 'white', padding: '8px 16px', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textDecoration: 'none', fontWeight: 600 }} className="hidden sm:inline">AI SIZER</Link>
            {/* User */}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isWestern ? 'white' : '#1a1410' }} className="hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="7" r="4" /><path d="M2 21s2-4 10-4 10 4 10 4" /></svg>
            </button>
            {/* Search */}
            <Link href="/search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isWestern ? 'white' : '#1a1410', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
            </Link>
            {/* Cart */}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isWestern ? 'white' : '#1a1410' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY MENU (Same for inner pages) */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 2000, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#1a1410' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div style={{ padding: '0 40px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <Link href="/ethnic-home" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', textDecoration: 'none', color: '#1a1410', letterSpacing: '2px' }}>ETHNIC WEAR</Link>
              <Link href="/western-home" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', textDecoration: 'none', color: '#1a1410', letterSpacing: '2px' }}>WESTERN WEAR</Link>
              <Link href="/collections/celebrity-styles" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', textDecoration: 'none', color: '#1a1410', letterSpacing: '2px' }}>CELEBRITY STYLES</Link>

              <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'make' } })) }} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#a17a58' }}>MAKE IT YOURSELF</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('openAsukaPanel', { detail: { tab: 'style' } })) }} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>AI STYLIST</a>
                <Link href="/sizing" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>AI SIZER</Link>
                <Link href="/store-locator" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>STORE LOCATOR</Link>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px', letterSpacing: '1px' }}>CATEGORIES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(isWestern ? WESTERN_NAV : ETHNIC_NAV).map(link => (
                    <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410', textTransform: 'uppercase' }}>{link.name}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
