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

  /* ══ HOMEPAGE — transparent floating header, overlays hero ══ */
  if (isHome) {
    return (
      <>
        {/* Brown announcement bar */}
        <div style={{ background: '#a17a58', color: 'white', padding: '10px 0', textAlign: 'center', position: 'relative', zIndex: 1002 }}>
          <a href="/store-locator" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', fontWeight: 500, color: 'white', textDecoration: 'none' }}>
            HYDERABAD | MUMBAI | AHMEDABAD
          </a>
        </div>

        {/* Floating nav — transparent, overlays the hero image */}
        <header
          className={`${isScrolled ? 'fixed top-0 bg-[#1a1410]/95 backdrop-blur-md h-16 shadow-lg shadow-black/20' : 'relative bg-transparent h-28'} left-0 right-0 z-[1001] transition-all duration-500 ease-in-out border-b border-white/5`}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 h-full max-w-[1800px] mx-auto w-full">

            {/* LEFT: Nav */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Hamburger (Tablet/Mobile) */}
              <button onClick={() => setIsMenuOpen(true)} className="md:hidden lg:hidden bg-transparent border-none text-white p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-4 lg:gap-8 overflow-hidden">
                <Link href="/ethnic-home" className="text-white no-underline text-[9px] font-mono tracking-[1.5px] font-medium uppercase hover:text-[#a17a58] transition-colors whitespace-nowrap">ETHNIC</Link>
                <Link href="/western-home" className="text-white no-underline text-[9px] font-mono tracking-[1.5px] font-medium uppercase hover:text-[#a17a58] transition-colors whitespace-nowrap">WESTERN</Link>
                <Link href="/collections/celebrity-styles" className="hidden lg:block text-white no-underline text-[9px] font-mono tracking-[1.5px] font-medium uppercase hover:text-[#a17a58] transition-colors whitespace-nowrap">CELEBRITY STYLES</Link>
              </div>
            </div>

            {/* CENTER: Stacked Logo */}
            <div className="flex justify-center px-4">
              <Link href="/" className="flex flex-col items-center group no-underline">
                <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412"
                  alt="Asuka"
                  className={`${isScrolled ? 'h-5' : 'h-10'} brightness-0 invert transition-all duration-300`}
                />
                <span className={`${isScrolled ? 'text-lg tracking-[4px]' : 'text-2xl tracking-[8px]'} font-serif text-white uppercase font-light transition-all duration-300 mt-1`}>ASUKĀ</span>
              </Link>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex justify-end items-center gap-4 lg:gap-6">
              <div className="hidden md:flex items-center gap-5">
                <Link href="/make-it-yourself" className="font-mono text-[9px] tracking-[1.5px] text-white no-underline opacity-80 hover:opacity-100 whitespace-nowrap">
                  ✦ MAKE IT YOURSELF
                </Link>
                <Link href="/sizing" className="bg-white text-[#a17a58] px-4 py-2 text-[9px] font-mono tracking-[1.5px] no-underline font-bold whitespace-nowrap hover:bg-[#a17a58] hover:text-white transition-colors">
                  AI SIZER
                </Link>
              </div>
              <Link href="/search" className="text-white p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
              </Link>
            </div>
          </div>
        </header>

        {/* This pull the Hero section under the transparent header */}
        {!isScrolled && <div className="h-0 -mb-28" />}

        {/* MOBILE OVERLAY MENU */}
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
                  <Link href="/make-it-yourself" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#a17a58' }}>MAKE IT YOURSELF</Link>
                  <Link href="/stylist" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>AI STYLIST</Link>
                  <Link href="/sizing" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>AI SIZER</Link>
                  <Link href="/store-locator" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>STORE LOCATOR</Link>
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
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: !isWestern ? '#1a1410' : '#1a1410', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          Ethnic Wear
        </Link>
        <Link href="/western-home"
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: '#1a1410' }}>
          Western Wear
        </Link>
      </div>

      {/* Sticky header — teal on western pages, white on ethnic */}
      <header
        style={{ transition: 'box-shadow 0.3s' }}
        className={`sticky top-0 z-[1001] bg-white ${isWestern ? 'border-none' : 'border-b border-[#eee]'} ${isScrolled ? 'shadow-md shadow-black/5' : 'shadow-none'}`}
      >
        <div className="flex items-center justify-between px-5 h-16 max-w-[1600px] mx-auto">
          {/* MOBILE ONLY: Hamburger */}
          <button onClick={() => setIsMenuOpen(true)} style={{ display: 'block', background: 'none', border: 'none', color: '#1a1410' }} className="md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" alt="Asuka" style={{ height: '24px' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', letterSpacing: '4px', color: '#a17a58', fontWeight: 400, textTransform: 'uppercase' }} className="hidden sm:inline">ASUKĀ</span>
          </Link>

          {/* Sub-nav (Desktop only) */}
          <nav style={{ gap: '24px', alignItems: 'center' }} className="hidden lg:flex">
            {(isWestern ? WESTERN_NAV : ETHNIC_NAV).map(link => (
              <Link key={link.name} href={link.href} style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#1a1410', textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'}
                onMouseLeave={e => e.currentTarget.style.color = '#1a1410'}>
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
            <Link href="/make-it-yourself" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: '#a17a58', textDecoration: 'none', whiteSpace: 'nowrap' }} className="hidden sm:inline">✦ MAKE IT YOURSELF</Link>
            <Link href="/sizing" style={{ background: '#a17a58', color: 'white', padding: '8px 16px', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textDecoration: 'none', fontWeight: 600 }} className="hidden sm:inline">AI SIZER</Link>
            {/* User */}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1a1410' }} className="hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="7" r="4" /><path d="M2 21s2-4 10-4 10 4 10 4" /></svg>
            </button>
            {/* Search */}
            <Link href="/search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1a1410', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
            </Link>
            {/* Cart */}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#1a1410' }}>
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
                <Link href="/make-it-yourself" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#a17a58' }}>MAKE IT YOURSELF</Link>
                <Link href="/stylist" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textDecoration: 'none', color: '#1a1410' }}>AI STYLIST</Link>
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
