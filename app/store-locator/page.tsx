'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const STORES = [
  {
    city: 'MUMBAI',
    img: 'https://asukacouture.com/cdn/shop/files/2024-09-19.jpg?v=1738236163&width=720',
    address: 'Showroom No. 1, 2 and 3, Ground Floor, The Designate by Shapoorji, Swami Vivekananda Rd, Santacruz (West), Mumbai, Maharashtra 400054',
    phone: '+91 93198 21030',
    map: 'https://maps.app.goo.gl/XxKsrqs3pzGzHX8g9',
  },
  {
    city: 'HYDERABAD',
    img: 'https://asukacouture.com/cdn/shop/files/WhatsApp_Image_2022-09-16_at_3.23.24_PM_copy.jpg?v=1738237404&width=720',
    address: 'Shop A, 120, TSG Heights, 8-2, 45, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91 90633 56542',
    map: 'https://maps.app.goo.gl/nEV8AzH19hFMDpgNA',
  },
  {
    city: 'AHMEDABAD',
    img: 'https://asukacouture.com/cdn/shop/files/desat.jpg?v=1738237527&width=720',
    address: 'Shop No 4 & 5, 3rd Eye One Complex, Panchvati Circle, C.G Road, Ellisbridge, Ahmedabad, Gujarat 380001',
    phone: '+91 93270 00888',
    map: 'https://maps.app.goo.gl/BXZEYFERMdDnucyb7',
  },
]

export default function StoreLocator() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main className="py-12 px-4 sm:px-8 md:px-12 max-w-[1400px] mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-[8px] text-[#1a1410] mb-4">STORE LOCATOR</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: '#a17a58' }}>VISIT OUR PHYSICAL ATELIERS</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {STORES.map(s => (
            <div key={s.city} style={{ textAlign: 'center' }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', marginBottom: '24px', background: '#f5f0e8' }}>
                <img src={s.img} alt={s.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#1a1410', marginBottom: '16px', fontWeight: 300 }}>{s.city}</h2>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444', marginBottom: '12px', minHeight: '60px' }}>{s.address}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a17a58', marginBottom: '24px' }}>T: {s.phone}</p>
              <a href={s.map} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 32px', border: '1px solid #1a1410', color: '#1a1410', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a1410'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1410' }}>
                GET DIRECTIONS
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
