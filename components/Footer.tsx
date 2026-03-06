'use client'
import Link from 'next/link'
import { FOOTER_CONTACT, FOOTER_LEGALS } from '@/lib/site-data'

export default function Footer() {
  return (
    <footer
      style={{ background: '#2c2218', color: '#fffdfd', borderTop: '2px solid #a17a58' }}
      className="py-16 px-6 sm:py-24 sm:px-10"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 mb-16">

          {/* Contact Us */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'white', marginBottom: '20px' }}>Contact us</h4>
            {FOOTER_CONTACT.stores.map(s => (
              <div key={s.city} style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                  {s.city} -: {s.address}
                </div>
                <a href={s.map} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#a17a58', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Visit {s.city.charAt(0) + s.city.slice(1).toLowerCase()}
                </a>
              </div>
            ))}
          </div>

          {/* Legals */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'white', marginBottom: '20px' }}>Legals</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {FOOTER_LEGALS.map(link => (
                <li key={link.name} style={{ marginBottom: '10px' }}>
                  <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a17a58'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'white', marginBottom: '20px' }}>Newsletter</h4>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px', lineHeight: 1.6 }}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
              <input type="email" placeholder="E-mail" style={{ background: 'none', border: 'none', color: 'white', fontFamily: 'var(--font-sans)', fontSize: '13px', width: '100%', outline: 'none' }} />
              <button type="button" style={{ background: 'none', border: 'none', color: '#a17a58', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: 'white', marginBottom: '20px' }}>Support</h4>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px' }}>Contact No -:</div>
              <a href="tel:9063356542" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>{FOOTER_CONTACT.phone}</a>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px' }}>Mail ID -:</div>
              <a href={`mailto:${FOOTER_CONTACT.email}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>{FOOTER_CONTACT.email}</a>
            </div>
            {/* Social */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <a href="https://www.instagram.com/asukacouture1991/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.facebook.com/theAsukaCouture/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://www.youtube.com/@asukacouture" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/asuka-couture/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href="mailto:support@asukacouture.com" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a17a58'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment + Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', gap: '20px' }} className="flex flex-col sm:flex-row justify-between items-center">
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
            © {new Date().getFullYear()} Asuka Couture
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Visa', 'Mastercard', 'PayPal', 'Google Pay'].map(name => (
              <span key={name} style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
