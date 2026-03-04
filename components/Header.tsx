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
          <a href="/pages/store-locator" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', fontWeight: 500, color: 'white', textDecoration: 'none' }}>
            HYDERABAD | MUMBAI | AHMEDABAD
          </a>
        </div>

        {/* Floating nav — transparent, overlays the hero image */}
        <header style={{
          position: 'absolute', top: '39px', left: 0, right: 0, zIndex: 1001,
          background: isScrolled ? 'rgba(26,20,16,0.85)' : 'transparent',
          transition: 'background 0.4s ease',
          backdropFilter: isScrolled ? 'blur(4px)' : 'none',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 48px', height: '80px', maxWidth: '1600px', margin: '0 auto',
          }}>
            {/* LEFT: Primary nav */}
            <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              {['ETHNIC', 'WESTERN', 'CELEBRITY STYLES'].map(item => (
                <Link key={item}
                  href={item === 'ETHNIC' ? '/pages/ethnic-home' : item === 'WESTERN' ? '/pages/western-home' : '/collections/celebrity-styles'}
                  style={{ color: 'white', textDecoration: 'none', fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', fontWeight: 500, opacity: 0.9, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}>
                  {item}
                </Link>
              ))}
            </nav>

            {/* CENTER: ASUKA logo */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" alt="Asuka" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '10px', color: 'white', textTransform: 'uppercase', fontWeight: 300 }}>ASUKĀ</span>
              </Link>
            </div>

            {/* RIGHT: AI links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/pages/make-it-yourself" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'white', textDecoration: 'none', opacity: 0.85, whiteSpace: 'nowrap' }}>
                ✦ MAKE IT YOURSELF
              </Link>
              <Link href="/stylist" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                AI STYLIST
              </Link>
              <Link href="/sizing" style={{ background: 'white', color: '#a17a58', padding: '8px 18px', fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                AI SIZER
              </Link>
            </div>
          </div>
        </header>
      </>
    )
  }

  /* ══ INNER PAGES — White sticky header ══ */
  return (
    <>
      {/* Ethnic / Western switcher bar */}
      <div style={{ display: 'flex', zIndex: 1002, position: 'relative' }}>
        <Link href="/pages/ethnic-home"
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: !isWestern ? '#1a1410' : '#1a1410', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          Ethnic Wear
        </Link>
        <Link href="/pages/western-home"
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'white', textDecoration: 'none', background: '#1a1410' }}>
          Western Wear
        </Link>
      </div>

      {/* Sticky header — teal on western pages, white on ethnic */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1001,
        background: 'white',
        borderBottom: isWestern ? 'none' : '1px solid #eee',
        boxShadow: isScrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px', height: '72px', maxWidth: '1600px', margin: '0 auto',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412" alt="Asuka" style={{ height: '28px' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '6px', color: '#a17a58', fontWeight: 400, textTransform: 'uppercase' }}>ASUKĀ</span>
          </Link>

          {/* Sub-nav — switches between Ethnic and Western categories */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
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
            <Link href="/pages/make-it-yourself" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: isWestern ? 'white' : '#a17a58', textDecoration: 'none', whiteSpace: 'nowrap' }}>✦ MAKE IT YOURSELF</Link>
            <Link href="/sizing" style={{ background: isWestern ? 'white' : '#a17a58', color: isWestern ? '#a17a58' : 'white', padding: '8px 16px', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textDecoration: 'none', fontWeight: 600 }}>AI SIZER</Link>
            {/* User */}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isWestern ? 'white' : '#1a1410' }}>
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
    </>
  )
}
