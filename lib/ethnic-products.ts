// Real product data from Asuka Couture Shopify store
// Source: /collections/ethnic-wear-for-men/products.json

export interface EthnicProduct {
  id: number
  title: string
  handle: string
  price: string
  compareAtPrice: string | null
  image: string
  tags: string[]
  category: string // derived from title/tags for filtering
}

// Helper to categorise products by their title keywords
function categorise(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('bandhgala')) return 'bandhgala-suit-for-men'
  if (t.includes('sherwani')) return 'sherwani'
  if (t.includes('indowestern') || t.includes('indo western') || t.includes('indo-western')) return 'indowestern-for-men'
  if (t.includes('bundi')) return 'kurta-bundi-set-for-men'
  if (t.includes('kurta')) return 'kurta-set-for-men'
  return 'ethnic-wear-for-men'
}

export const ETHNIC_PRODUCTS: EthnicProduct[] = [
  {
    id: 10189430390916,
    title: 'Honey Gold Embroidered Royal Kurta Set',
    handle: 'honey-gold-embroidered-royal-kurta-set',
    price: '18500.00',
    compareAtPrice: '18500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG40-11213.jpg?v=1771275532&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189430358148,
    title: 'Blush Pink Self-Textured Heritage Kurta Set',
    handle: 'blush-pink-self-textured-heritage-kurta-set',
    price: '27950.00',
    compareAtPrice: '27950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG39-57817.jpg?v=1771275607&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189430325380,
    title: 'Ivory Imperial Brocade Sherwani Set',
    handle: 'ivory-imperial-brocade-sherwani-set',
    price: '150000.00',
    compareAtPrice: '150000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG39-11161.jpg?v=1771275677&width=600',
    tags: ['Ethnic'],
    category: 'sherwani',
  },
  {
    id: 10189430292612,
    title: 'Lilac Metallic Statement Bandhgala Set',
    handle: 'lilac-metallic-statement-bandhgala-set',
    price: '67500.00',
    compareAtPrice: '67500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG38-12519.jpg?v=1771275823&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189430259844,
    title: 'Pearl Embroidered Angrakha Indowestern Set',
    handle: 'pearl-embroidered-angrakha-indowestern-set',
    price: '88950.00',
    compareAtPrice: '88950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG38-11146.jpg?v=1771275884&width=600',
    tags: ['Ethnic'],
    category: 'indowestern-for-men',
  },
  {
    id: 10189430227076,
    title: 'Dusty Pink Embroidered Bandhgala Set',
    handle: 'dusty-pink-embroidered-bandhgala-set',
    price: '62500.00',
    compareAtPrice: '62500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG37-12472.jpg?v=1771275940&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189430161540,
    title: 'Ivory Royal Crest Bandhgala Set',
    handle: 'ivory-royal-crest-bandhgala-set',
    price: '28500.00',
    compareAtPrice: '28500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG37-11086.jpg?v=1771275991&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189430096004,
    title: 'Cream Subtle Motif Bandhgala Set',
    handle: 'cream-subtle-motif-bandhgala-set',
    price: '48950.00',
    compareAtPrice: '48950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG36-11068.jpg?v=1771276127&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189430063236,
    title: 'Ivory Structured Jacquard Indowestern Set',
    handle: 'ivory-structured-jacquard-indowestern-set',
    price: '85000.00',
    compareAtPrice: '85000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG35-12402.jpg?v=1771276255&width=600',
    tags: ['Ethnic'],
    category: 'indowestern-for-men',
  },
  {
    id: 10189429964932,
    title: 'Ivory Brocade Heritage Bandhgala Set',
    handle: 'ivory-brocade-heritage-bandhgala-set',
    price: '65000.00',
    compareAtPrice: '65000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG35-11027.jpg?v=1771276306&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189429932164,
    title: 'Maroon Textured Royal Kurta Set',
    handle: 'maroon-textured-royal-kurta-set',
    price: '25000.00',
    compareAtPrice: '25000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG34-12366.jpg?v=1771276382&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429899396,
    title: 'Beige Ornamental Tapestry Bandhgala Set',
    handle: 'beige-ornamental-tapestry-bandhgala-set',
    price: '72500.00',
    compareAtPrice: '72500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG34-10956_d66a11d7-c6b4-45b1-86ee-fe06a4ead984.jpg?v=1771276846&width=600',
    tags: ['Ethnic'],
    category: 'bandhgala-suit-for-men',
  },
  {
    id: 10189429866628,
    title: 'Black Multicolour Regal Motif Kurta Set',
    handle: 'black-multicolour-regal-motif-kurta-set',
    price: '36000.00',
    compareAtPrice: '36000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG33-12336.jpg?v=1771276956&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429833860,
    title: 'Gold Antique Brocade Indowestern Set',
    handle: 'gold-antique-brocade-indowestern-set',
    price: '135000.00',
    compareAtPrice: '135000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG33-10897.jpg?v=1771277051&width=600',
    tags: ['Ethnic'],
    category: 'indowestern-for-men',
  },
  {
    id: 10189429801092,
    title: 'Black Onyx Minimal Kurta Set',
    handle: 'black-onyx-minimal-kurta-set',
    price: '21500.00',
    compareAtPrice: '78500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG32-12310.jpg?v=1771277194&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429768324,
    title: 'Deep Olive Green Floral Embroidered Long Sherwani',
    handle: 'deep-olive-green-floral-embroidered-long-sherwani',
    price: '36500.00',
    compareAtPrice: '36500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG32-10852.jpg?v=1771277252&width=600',
    tags: ['Ethnic'],
    category: 'sherwani',
  },
  {
    id: 10189429735556,
    title: 'Black Stripe Handloom Kurta Set',
    handle: 'black-stripe-handloom-kurta-set',
    price: '35000.00',
    compareAtPrice: '35000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG31-12281.jpg?v=1771277306&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429702788,
    title: 'Champagne Gold Woven Kurta Bundi Set',
    handle: 'champagne-gold-woven-kurta-bundi-set',
    price: '32000.00',
    compareAtPrice: '32000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG31-10828.jpg?v=1771277582&width=600',
    tags: ['Ethnic'],
    category: 'kurta-bundi-set-for-men',
  },
  {
    id: 10189429670020,
    title: 'Black Regal Texture Kurta Set',
    handle: 'black-regal-texture-kurta-set',
    price: '18000.00',
    compareAtPrice: '135950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG30-12255.jpg?v=1771277483&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429637252,
    title: 'Crimson Heritage Zari Kurta Bundi Set',
    handle: 'crimson-heritage-zari-kurta-bundi-set',
    price: '32950.00',
    compareAtPrice: '32950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG30-10785.jpg?v=1771277509&width=600',
    tags: ['Ethnic'],
    category: 'kurta-bundi-set-for-men',
  },
  {
    id: 10189429604484,
    title: 'Graphite Paisley Jacquard Kurta Set',
    handle: 'graphite-paisley-jacquard-kurta-set',
    price: '32000.00',
    compareAtPrice: '32000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG29-12228.jpg?v=1771277567&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429571716,
    title: 'Coral Ornamental Threadwork Kurta Bundi Set',
    handle: 'coral-ornamental-threadwork-kurta-bundi-set',
    price: '25000.00',
    compareAtPrice: '25000.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG29-10754.jpg?v=1771277693&width=600',
    tags: ['Ethnic'],
    category: 'kurta-bundi-set-for-men',
  },
  {
    id: 10189429538948,
    title: 'Black Ivory Panel Embroidered Kurta Set',
    handle: 'black-ivory-panel-embroidered-kurta-set',
    price: '29500.00',
    compareAtPrice: '29500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG28-12208.jpg?v=1771277788&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429506180,
    title: 'Red Gold Brocade Kurta Bundi Set',
    handle: 'red-gold-brocade-kurta-bundi-set',
    price: '39500.00',
    compareAtPrice: '39500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG28-10710.jpg?v=1771277831&width=600',
    tags: ['Ethnic'],
    category: 'kurta-bundi-set-for-men',
  },
  {
    id: 10189429473412,
    title: 'Black Scarlet Highlight Kurta Set',
    handle: 'black-scarlet-highlight-kurta-set',
    price: '32500.00',
    compareAtPrice: '32500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG27-12173.jpg?v=1771277912&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429440644,
    title: 'Ivory Heritage Butti Embroidered Kurta Set',
    handle: 'ivory-heritage-butti-embroidered-kurta-set',
    price: '27950.00',
    compareAtPrice: '27950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG27-10675.jpg?v=1771277990&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429407876,
    title: 'Charcoal Abstract Texture Kurta Set',
    handle: 'charcoal-abstract-texture-kurta-set',
    price: '38500.00',
    compareAtPrice: '38500.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG26-12150.jpg?v=1771278024&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
  {
    id: 10189429375108,
    title: 'Rust Ornamental Brocade Kurta Set',
    handle: 'rust-ornamental-brocade-kurta-set',
    price: '25950.00',
    compareAtPrice: '25950.00',
    image: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/TAG26-10648.jpg?v=1771278052&width=600',
    tags: ['Ethnic'],
    category: 'kurta-set-for-men',
  },
]

export function getProductsByCategory(category: string, limit = 6): EthnicProduct[] {
  return ETHNIC_PRODUCTS.filter(p => p.category === category).slice(0, limit)
}

export function getAllProducts(limit = 30): EthnicProduct[] {
  return ETHNIC_PRODUCTS.slice(0, limit)
}
