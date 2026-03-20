'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutUs() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[350px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <img
            src="https://asukacouture.com/cdn/shop/files/Screenshot_2025-02-22_at_2.33.36_PM.png?v=1740215030"
            alt="About Asuka"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.8 }}
          />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[8px] uppercase mb-6">ABOUT US</h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px' }}>RITUALS OF FINE DRESSING</div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 max-w-[1000px] mx-auto text-center">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#a17a58', marginBottom: '40px', fontWeight: 300 }}>Our Vision</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#444', marginBottom: '32px', fontWeight: 300 }}>
            Founded in 1991, Asuka Couture has been a beacon of luxury men's fashion, blending timeless traditions with modern silhouettes. Our journey began with a simple passion: to create clothes that celebrate the ritual of dressing up.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#444', fontWeight: 300 }}>
            Every garment at Asuka is a labor of love, crafted by master tailors and artisans who understand that elegance lies in the details—from the choice of the finest habutai silks to the intricacy of every dori embroidery.
          </p>
        </section>

        {/* Pillars Section */}
        <section style={{ background: '#FAF6F1', padding: '100px 48px' }}>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>🧵</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#1a1410', marginBottom: '16px' }}>Master Tailoring</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666' }}>Decades of expertise in pattern making and structural fit for the ultimate silhouette.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#1a1410', marginBottom: '16px' }}>Artisanal Craft</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666' }}>Hand-done embroideries and intricate detailing that tell a story of heritage.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>🌿</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#1a1410', marginBottom: '16px' }}>Finest Fabrics</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666' }}>Sourcing only the most premium silks, woolens, and linens from around the world.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
