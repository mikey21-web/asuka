'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Appointment() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main className="py-12 px-4 sm:px-8 md:px-12 max-w-[1000px] mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[6px] sm:tracking-[8px] text-[#1a1410] mb-4">BOOK AN APPOINTMENT</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58' }}>PERSONAL STYLING SESSIONS</div>
        </div>

        <div className="bg-[#FAF6F1] p-6 sm:p-10 md:p-[60px] rounded">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
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
    </div>
  )
}
