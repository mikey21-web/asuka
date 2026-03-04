'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIWidget from '@/components/widget/AIWidget'

export default function Contact() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main style={{ padding: '80px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, letterSpacing: '8px', color: '#1a1410', marginBottom: '16px' }}>CONTACT US</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58' }}>CONNECT WITH OUR ATELIER</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#1a1410', marginBottom: '40px', fontWeight: 300 }}>Get in Touch</h2>
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', color: '#a17a58', marginBottom: '12px', textTransform: 'uppercase' }}>Phone</h3>
              <p style={{ fontSize: '16px', color: '#444' }}>+91 93198 21030 / +91 90633 56542</p>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', color: '#a17a58', marginBottom: '12px', textTransform: 'uppercase' }}>Email</h3>
              <p style={{ fontSize: '16px', color: '#444' }}>support@asukacouture.com</p>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', color: '#a17a58', marginBottom: '12px', textTransform: 'uppercase' }}>Showrooms</h3>
              <p style={{ fontSize: '16px', color: '#444', marginBottom: '8px' }}>Hyderabad: Banjara Hills, Road No. 2</p>
              <p style={{ fontSize: '16px', color: '#444', marginBottom: '8px' }}>Mumbai: Santacruz West, S.V. Road</p>
              <p style={{ fontSize: '16px', color: '#444' }}>Ahmedabad: C.G. Road, Ellisbridge</p>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div style={{ background: '#FAF6F1', padding: '48px', borderRadius: '4px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>NAME</label>
              <input type="text" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>EMAIL</label>
              <input type="email" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>MESSAGE</label>
              <textarea rows={4} style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }}></textarea>
            </div>
            <button type="button" style={{ width: '100%', padding: '16px', background: '#1a1410', color: 'white', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '3px', cursor: 'pointer', transition: 'background 0.3s' }}>
              SEND MESSAGE
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <AIWidget />
    </div>
  )
}
