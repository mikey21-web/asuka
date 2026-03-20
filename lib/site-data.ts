/* ═══════════════════════════════════════════════════════════
   ASUKA COUTURE — SITE DATA
   All navigation, hero, footer, store, and brand data
   extracted from the LIVE asukacouture.com
   ═══════════════════════════════════════════════════════════ */

/* ── Hero banner images (CDN) ── */
export const HERO_ETHNIC = 'https://asukacouture.com/cdn/shop/files/2_550d2346-b3c7-4096-822c-b4cb7995459a.png?v=1730798432&width=1920'
export const HERO_WESTERN = 'https://asukacouture.com/cdn/shop/files/1_5915f598-659c-4960-8a78-5e57ef51ddfb.png?v=1730798432&width=1920'

/* ── Announcement bar texts (2 rotating slides) ── */
export const ANNOUNCEMENTS = [
    { text: 'HYDERABAD | MUMBAI | AHMEDABAD', href: '/store-locator' },
    { text: 'Hassle-free returns — 30-day postage paid returns', href: '' },
]

/* ── Navigation ── */
export const NAV_ETHNIC = [
    { name: 'Bandhgala', href: '/collections/bandhgala-suit-for-men' },
    { name: 'Indo-western', href: '/collections/indowestern-for-men' },
    { name: 'Kurta Bundi Set', href: '/collections/kurta-bundi-set-for-men' },
    { name: 'Kurta Set', href: '/collections/kurta-set-for-men' },
    { name: 'Sherwani', href: '/collections/sherwani' },
]

export const NAV_WESTERN = [
    { name: 'Shirts', href: '/collections/buy-shirts-for-men' },
    { name: 'Co-ord Sets', href: '/collections/co-ord-sets-for-men' },
    { name: 'Tuxedo Sets', href: '/collections/buy-tuxedo-suit-for-wedding' },
    { name: 'Formal Suits', href: '/collections/suit-set-for-men' },
    { name: 'Jackets', href: '/collections/jackets-for-men' },
    { name: 'Casual Suits', href: '/collections/casual-suits-for-men' },
]

export const NAV_ACCESSORIES = [
    { name: 'Embroidered Shoes', href: '/collections/embroidered-shoes-for-men' },
    { name: 'Embroidered Stoles', href: '/collections/embroidered-stoles' },
]

/* ── Logo ── */
export const LOGO_URL = 'https://asukacouture.com/cdn/shop/files/Untitled_design_70x.png?v=1672665412'

/* ── Celebrity product handles (Spotted in Asuka section) ── */
export const CELEBRITY_HANDLES = [
    'hdhs',
    'tiger-shroff-in-charcoal-grey-woolen-suit-set',
    'emraan-hashmi-in-off-white-pinstripe-ceremonial-ensemble',
    'dulquer-salman-in-mystic-terrain-habutai-silk-shirt',
    'shiv-thakare-in-black-floraison-dori-kurta-set',
    'timeless-navy-pinstripe-suit',
]

/* ── Store Locator ── */
export const STORES = [
    {
        city: 'mumbai',
        img: 'https://asukacouture.com/cdn/shop/files/2024-09-19.jpg?v=1738236163&width=720',
        address: 'Showroom No. 1, 2 and 3, Ground Floor, The Designate by Shapoorji, Swami Vivekananda Rd, Santacruz (West), Mumbai, Maharashtra 400054',
        hours: '11:00am - 9:30pm (all seven days)',
        map: 'https://maps.app.goo.gl/XxKsrqs3pzGzHX8g9',
    },
    {
        city: 'hyderabad',
        img: 'https://asukacouture.com/cdn/shop/files/WhatsApp_Image_2022-09-16_at_3.23.24_PM_copy.jpg?v=1738237404&width=720',
        address: 'Shop A, 120, TSG Heights, 8-2, 45, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034',
        hours: '11:00am - 9:30pm (all seven days)',
        map: 'https://maps.app.goo.gl/nEV8AzH19hFMDpgNA',
    },
    {
        city: 'ahmedabad',
        img: 'https://asukacouture.com/cdn/shop/files/desat.jpg?v=1738237527&width=720',
        address: 'Shop No 4 & 5, 3rd Eye One Complex, Panchvati Circle, C.G Road, Ellisbridge, Ahmedabad, Gujarat 380001',
        hours: '11:00am - 9:30pm (all seven days)',
        map: 'https://maps.app.goo.gl/BXZEYFERMdDnucyb7',
    },
]

/* ── Press / Brand slider images ── */
export const BRAND_SLIDER_IMAGES = [
    'https://asukacouture.com/cdn/shop/files/Screenshot_2025-02-22_at_2.33.36_PM.png?v=1740215030',
    'https://asukacouture.com/cdn/shop/files/IMG_8689.jpg?v=1740213132',
    'https://asukacouture.com/cdn/shop/files/unnamed_0d3af335-173a-44fd-8159-442c54830e3c.jpg?v=1740171053',
    'https://asukacouture.com/cdn/shop/files/images.jpg?v=1740137878',
    'https://asukacouture.com/cdn/shop/files/apple-icon-120x120.png?v=1740214039',
    'https://asukacouture.com/cdn/shop/files/idc1IUtDaN_1740182555606_2.jpg?v=1740213954',
    'https://asukacouture.com/cdn/shop/files/IMG_8687.png?v=1740213922',
    'https://asukacouture.com/cdn/shop/files/IMG_8688.png?v=1740213903',
    'https://asukacouture.com/cdn/shop/files/IMG_8690.jpg?v=1740213128',
    'https://asukacouture.com/cdn/shop/files/IMG_8691.png?v=1740213125',
    'https://asukacouture.com/cdn/shop/files/IMG_8694.png?v=1740213118',
    'https://asukacouture.com/cdn/shop/files/IMG_8696.png?v=1740213109',
    'https://asukacouture.com/cdn/shop/files/IMG_8698.png?v=1740212984',
    'https://asukacouture.com/cdn/shop/files/IMG_8699.png?v=1740212963',
]

/* ── Footer Links (exact from live site) ── */
export const FOOTER_CONTACT = {
    stores: [
        { city: 'MUMBAI', address: 'S.V Road, Willingdon, Santacruz West', map: 'https://maps.app.goo.gl/uzYiZ9SKcfBZoPGe9' },
        { city: 'HYDERABAD', address: 'Road No. 2, Banjara Hills', map: 'https://maps.app.goo.gl/SP9Cf8GG2VB7URsCA' },
        { city: 'AHMEDABAD', address: 'Panchvati Circle, C.G. Road', map: 'https://maps.app.goo.gl/LaBGPBkepDJbrEsr6' },
    ],
    phone: '+91 9063356542',
    email: 'info@asukacouture.com',
}

export const FOOTER_LEGALS = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'AI Stylist', href: '/ai-stylist' },
    { name: 'Shipping Policy', href: 'https://asukacouture.com/policies/shipping-policy' },
    { name: 'Return Policy', href: 'https://asukacouture.com/policies/refund-policy' },
    { name: 'Stockists', href: '/stockists' },
    { name: 'Terms of Service', href: 'https://asukacouture.com/policies/terms-of-service' },
    { name: 'Privacy Policy', href: 'https://asukacouture.com/policies/privacy-policy' },
    { name: 'Store Locator', href: '/store-locator' },
    { name: 'Book an Appointment', href: '/book-an-appointment' },
    { name: 'Blog', href: 'https://asukacouture.com/blogs/posts' },
]

/* ── Ethnic Home — Shop by Occasion ── */
export const OCCASIONS = [
    { name: 'Haldi', href: '/collections/haldi', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/collections/Your_paragraph_text_-_1.png?v=174143646' },
    { name: 'Mehendi', href: '/collections/mehendi', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/collections/Your_paragraph_text_-_7.png?v=174143657' },
    { name: 'Sangeet', href: '/collections/sangeet', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG38-11146.jpg?v=1771275884' },
    { name: 'Wedding', href: '/collections/wedding', img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG39-11161.jpg?v=1771275677' },
]

/* ── Ethnic Home — Timeless Traditions ── */
export const TRADITIONS = [
    { name: 'BANDHGALA', href: '/collections/bandhgala-suit-for-men' },
    { name: 'INDO WESTERN', href: '/collections/indowestern-for-men' },
    { name: 'KURTA BUNDI SET', href: '/collections/kurta-bundi-set-for-men' },
    { name: 'KURTA SET', href: '/collections/kurta-set-for-men' },
    { name: 'SHERWANI', href: '/collections/sherwani' },
    { name: 'SHOP ALL', href: '/collections/ethnic-wear-for-men' },
]

/* ── Collections metadata ── */
export const COLLECTIONS = [
    { id: 276052574340, title: 'ALL PRODUCTS', handle: 'luxury-men-clothing' },
    { id: 277166882948, title: 'BANDHGALA', handle: 'bandhgala-suit-for-men' },
    { id: 281905463428, title: 'Best Selling Products', handle: 'best-selling-products' },
    { id: 283429142660, title: 'Casual Suits', handle: 'casual-suits-for-men' },
    { id: 435118211204, title: 'Celebrity Styles', handle: 'celebrity-styles' },
    { id: 282822967428, title: 'Co-ord Sets', handle: 'co-ord-sets-for-men' },
    { id: 437495169156, title: 'Cocktail', handle: 'cocktail' },
    { id: 642470019204, title: 'Embroidered Shirts', handle: 'embroidered-shirts' },
    { id: 282195984516, title: 'Embroidered Shoes', handle: 'embroidered-shoes-for-men' },
    { id: 435040649348, title: 'Embroidered Stoles', handle: 'embroidered-stoles' },
    { id: 283366391940, title: 'Ethnic Wear', handle: 'ethnic-wear-for-men' },
    { id: 280326504580, title: 'Featured Collection', handle: 'featured-collection' },
    { id: 281827410052, title: 'Festive Wear', handle: 'festive-wear-for-men' },
    { id: 282537394308, title: 'Formal Suits', handle: 'suit-set-for-men' },
    { id: 437494775940, title: 'Haldi', handle: 'haldi' },
    { id: 277279899780, title: 'INDO WESTERN', handle: 'indowestern-for-men' },
    { id: 283346698372, title: 'Jackets', handle: 'jackets-for-men' },
    { id: 277167014020, title: 'KURTA BUNDI SET', handle: 'kurta-bundi-set-for-men' },
    { id: 277167210628, title: 'KURTA SET', handle: 'kurta-set-for-men' },
    { id: 646288572548, title: 'Loomsongs', handle: 'loomsongs' },
    { id: 647334854788, title: 'Mastaan', handle: 'mastaan' },
    { id: 281905725572, title: 'Mega Menu - Featured Products', handle: 'mega-menu-featured-products' },
    { id: 437494874244, title: 'Mehendi', handle: 'mehendi' },
    { id: 281685426308, title: 'Meraak', handle: 'meraak-for-men' },
    { id: 281685393540, title: 'Mishri', handle: 'mishri-traditional-clothing-for-men' },
    { id: 648497692804, title: 'NEW ARRIVALS', handle: 'new-arrivals' },
    { id: 281905496196, title: 'Newest Products', handle: 'newest-products' },
    { id: 281001459844, title: 'Perfume', handle: 'perfume' },
    { id: 283337261188, title: 'Primavera', handle: 'primavera-menswear' },
    { id: 642469494916, title: 'Printed Shirts', handle: 'printed-shirts' },
]

/* ── Helpers ── */
export function formatPrice(price: string | number): string {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return `Rs. ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}
