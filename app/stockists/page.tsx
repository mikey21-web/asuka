import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function StockistsPage() {
    return (
        <>
            <Header />
            <main style={{ padding: '120px 40px', textAlign: 'center', background: 'white', minHeight: '60vh' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', color: '#1a1410', fontWeight: 300, marginBottom: '24px' }}>Our Stockists</h1>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
                    Find Asuka Couture collections at premium boutiques across the globe.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px' }}>Aza Fashion</h3>
                        <p style={{ fontSize: '14px', color: '#888' }}>Mumbai | Delhi | Online</p>
                    </div>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px' }}>Ogaan</h3>
                        <p style={{ fontSize: '14px', color: '#888' }}>Delhi | Hyderabad</p>
                    </div>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px' }}>Ensemble</h3>
                        <p style={{ fontSize: '14px', color: '#888' }}>Mumbai | Online</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
