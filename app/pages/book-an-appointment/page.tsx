'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIWidget from '@/components/widget/AIWidget'

export default function Appointment() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main style={{ padding: '80px 48px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, letterSpacing: '8px', color: '#1a1410', marginBottom: '16px' }}>BOOK AN APPOINTMENT</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58' }}>PERSONAL STYLING SESSIONS</div>
        </div>

        <div style={{ background: '#FAF6F1', padding: '60px', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>FULL NAME</label>
              <input type="text" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>PHONE NUMBER</label>
              <input type="tel" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>SELECT CITY</label>
            <select style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none', appearance: 'none' }}>
              <option>Mumbai (Santacruz West)</option>
              <option>Hyderabad (Banjara Hills)</option>
              <option>Ahmedabad (Ellisbridge)</option>
              <option>Virtual Consultation</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>DATE</label>
              <input type="date" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>TIME SLOT</label>
              <input type="time" style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px', color: '#a17a58' }}>INTERESTED IN (OPTIONAL)</label>
            <textarea rows={3} placeholder="Sherwani, Suit, Indowestern..." style={{ width: '100%', padding: '12px', border: '1px solid #d4c4b0', background: 'white', outline: 'none' }}></textarea>
          </div>

          <button type="button" style={{ width: '100%', padding: '16px', background: '#1a1410', color: 'white', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '3px', cursor: 'pointer' }}>
            REQUEST APPOINTMENT
          </button>
        </div>
      </main>
      <Footer />
      <AIWidget />
    </div>
  )
}
