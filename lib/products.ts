export interface Product {
  id: string
  name: string
  price: number
  type: string
  fabric: string
  occasion: string[]
  style: string
  img: string
  url: string
  slug: string
  collection: 'ethnic' | 'western'
  category: string
  isCelebrity?: boolean
  celebrityName?: string
}

export interface SimplifiedProduct {
  name: string
  price: number
  type: string
  fabric: string
  occasion: string[]
  style: string[]
  img: string
  url: string
  handle?: string
}

export const ASUKA_CATALOG: Product[] = [
  // Ethnic Collection
  {
    id: 'b1',
    name: 'Midnight Blue Sequins Bandhgala',
    price: 48500,
    type: 'Bandhgala',
    fabric: 'Silk',
    occasion: ['Wedding', 'Reception', 'Cocktail'],
    style: 'Classic',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/36.jpg?v=1705950920',
    url: 'https://asukacouture.com/products/midnight-blue-sequins-embellished-bandhgala',
    slug: 'midnight-blue-sequins-embellished-bandhgala',
    collection: 'ethnic',
    category: 'Bandhgala'
  },
  {
    id: 'b2',
    name: 'Azalea Black Linen Bandhgala',
    price: 65000,
    type: 'Bandhgala',
    fabric: 'Linen',
    occasion: ['Wedding', 'Reception'],
    style: 'Regal',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/J-12-163982.jpg?v=1731449638',
    url: 'https://asukacouture.com/products/azalea-black-linen-embroidered-bandhgala-set',
    slug: 'azalea-black-linen-embroidered-bandhgala-set',
    collection: 'ethnic',
    category: 'Bandhgala'
  },
  {
    id: 'k1',
    name: 'Ivory Splendor Kurta Bundi Set',
    price: 39500,
    type: 'Kurta Set',
    fabric: 'Georgette Silk',
    occasion: ['Wedding', 'Grand', 'Ceremonial'],
    style: 'Imperial',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/Shop_Ivory_Splendor_Georgette_Silk_Kurta_Bundi_Set.jpg?v=1732526701',
    url: 'https://asukacouture.com/products/ivory-splendor-georgette-silk-kurta-bundi-set',
    slug: 'ivory-splendor-georgette-silk-kurta-bundi-set',
    collection: 'ethnic',
    category: 'Kurta Set'
  },
  {
    id: 'k2',
    name: 'Sunlit Meadow Embroidered Kurta',
    price: 24000,
    type: 'Kurta Set',
    fabric: 'Luxury Blends',
    occasion: ['Day Festive', 'Outdoor'],
    style: 'Artisanal',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/M-12-165032.jpg?v=1731284149',
    url: 'https://asukacouture.com/products/sunlit-meadow-embroidered-kurta-set',
    slug: 'sunlit-meadow-embroidered-kurta-set',
    collection: 'ethnic',
    category: 'Kurta Set'
  },
  {
    id: 's1',
    name: 'Royal Zardosi Sherwani',
    price: 125000,
    type: 'Sherwani',
    fabric: 'Raw Silk',
    occasion: ['Groom', 'Wedding'],
    style: 'Grand',
    img: 'https://asukacouture.com/cdn/shop/files/ASUKA_8801_720x.jpg',
    url: 'https://asukacouture.com/products/royal-zardosi-sherwani',
    slug: 'royal-zardosi-sherwani',
    collection: 'ethnic',
    category: 'Sherwani'
  },

  // Western Collection
  {
    id: 't1',
    name: 'Obsidian Silk Tuxedo',
    price: 65000,
    type: 'Tuxedo',
    fabric: 'Italian Silk',
    occasion: ['Reception', 'Cocktail', 'Black Tie'],
    style: 'Modern',
    img: 'https://asukacouture.com/cdn/shop/files/ASUKA_8921_720x.jpg',
    url: 'https://asukacouture.com/products/obsidian-silk-tuxedo',
    slug: 'obsidian-silk-tuxedo',
    collection: 'western',
    category: 'Tuxedo Sets'
  },
  {
    id: 'sh1',
    name: 'Signature Linen Shirt',
    price: 8500,
    type: 'Shirt',
    fabric: 'Linen',
    occasion: ['Resort', 'Casual', 'Brunch'],
    style: 'Minimal',
    img: 'https://asukacouture.com/cdn/shop/files/ASUKA_9012_720x.jpg',
    url: 'https://asukacouture.com/products/signature-linen-shirt',
    slug: 'signature-linen-shirt',
    collection: 'western',
    category: 'Shirts'
  },
  {
    id: 'c1',
    name: 'Black Suede Biker Jacket Set',
    price: 21500,
    type: 'Jacket Set',
    fabric: 'Suede',
    occasion: ['Party', 'Celebrity Style'],
    style: 'Edgy',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/IMG-7042.png?v=1734897114',
    url: 'https://asukacouture.com/products/hdhs',
    slug: 'black-suede-biker-jacket-set',
    collection: 'western',
    category: 'Jackets',
    isCelebrity: true,
    celebrityName: 'Akshay Kumar'
  },
  {
    id: 'c2',
    name: 'Charcoal Grey Woolen Suit',
    price: 30000,
    type: 'Suit Set',
    fabric: 'Wool',
    occasion: ['Red Carpet', 'Celebrity Style'],
    style: 'Modern',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/12C86967-8E23-4759-83AF-81D8FC5B65A1.png?v=1748530032',
    url: 'https://asukacouture.com/products/tiger-shroff-in-charcoal-grey-woolen-suit-set',
    slug: 'charcoal-grey-woolen-suit-set',
    collection: 'western',
    category: 'Formal Suits',
    isCelebrity: true,
    celebrityName: 'Tiger Shroff'
  },
  {
    id: 'c3',
    name: 'Off-White Pinstripe Ceremonial',
    price: 31500,
    type: 'Ceremonial',
    fabric: 'Linen Silk',
    occasion: ['Wedding', 'Celebrity Style'],
    style: 'Luxurious',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/9C2FB90B-976D-4999-9297-A1C24C20C8B5.png?v=1735413543',
    url: 'https://asukacouture.com/products/emraan-hashmi-in-off-white-pinstripe-ceremonial-ensemble',
    slug: 'off-white-pinstripe-ceremonial-ensemble',
    collection: 'ethnic',
    category: 'Indo-Western',
    isCelebrity: true,
    celebrityName: 'Emraan Hashmi'
  },
  {
    id: 'c4',
    name: 'Shiv Thakare in Black Floraison Dori Kurta',
    price: 28950,
    type: 'Kurta Set',
    fabric: 'Chanderi Silk',
    occasion: ['Wedding', 'Celebrity Style'],
    style: 'Artisanal',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/J-14-164722.jpg?v=1735415385',
    url: 'https://asukacouture.com/products/shiv-thakare-in-black-floraison-dori-kurta-set',
    slug: 'shiv-thakare-in-black-floraison-dori-kurta-set',
    collection: 'ethnic',
    category: 'Kurta Set',
    isCelebrity: true,
    celebrityName: 'Shiv Thakare'
  },
  {
    id: 'k3',
    name: 'Lavender Ombre Indo-Western Set',
    price: 72500,
    type: 'Indo-Western',
    fabric: 'Silk Ombre',
    occasion: ['Wedding', 'Celebrity Style', 'Cocktail'],
    style: 'Fusion',
    img: 'https://asukacouture.com/cdn/shop/files/ASUKA_8801_720x.jpg',
    url: 'https://asukacouture.com/products/lavender-ombre-embroidered-indo-western-set',
    slug: 'lavender-ombre-embroidered-indo-western-set',
    collection: 'ethnic',
    category: 'Indo-Western'
  },
  {
    id: 'k4',
    name: 'Antique Periwinkle Tussar Kurta Set',
    price: 35000,
    type: 'Kurta Set',
    fabric: 'Tussar Silk',
    occasion: ['Festive', 'Wedding Guest'],
    style: 'Artisanal',
    img: 'https://cdn.shopify.com/s/files/1/0600/0849/7284/files/M-12-165032.jpg',
    url: 'https://asukacouture.com/products/antique-periwinkle-tussar-kantha-embroidered-kurta-set',
    slug: 'antique-periwinkle-tussar-kantha-embroidered-kurta-set',
    collection: 'ethnic',
    category: 'Kurta Set'
  },
  {
    id: 'c5',
    name: 'Dulquer Salman in Mystic Terrain Shirt',
    price: 8950,
    type: 'Shirt',
    fabric: 'Habutai Silk',
    occasion: ['Resort', 'Casual'],
    style: 'Relaxed',
    img: 'https://asukacouture.com/cdn/shop/files/ASKMSH-00458_1.jpg?v=1712140000',
    url: 'https://asukacouture.com/products/dulquer-salman-in-mystic-terrain-habutai-silk-shirt',
    slug: 'dulquer-salman-in-mystic-terrain-habutai-silk-shirt',
    collection: 'western',
    category: 'Shirts',
    isCelebrity: true,
    celebrityName: 'Dulquer Salman'
  }
]

export function getProductBySlug(slug: string) {
  return ASUKA_CATALOG.find(p => p.slug === slug)
}

export function getProductsByCollection(collection: 'ethnic' | 'western') {
  return ASUKA_CATALOG.filter(p => p.collection === collection)
}

export function getProductsByCategory(category: string) {
  return ASUKA_CATALOG.filter(p => p.category === category)
}

// Real Asuka products catalogue for RAG context & UI matching
export const ASUKA_PRODUCTS: SimplifiedProduct[] = ASUKA_CATALOG.map(p => ({
  name: p.name,
  price: p.price,
  type: p.type,
  fabric: p.fabric,
  occasion: (p.occasion || []),
  style: [p.style.toLowerCase()],
  img: p.img,
  url: p.url,
  handle: p.slug
}))

/**
 * Parses assistant reply for product names in bold **[Product Name]** 
 * and returns the full product objects for the UI grid.
 */
export function matchProducts(text: string) {
  const matches = text.match(/\*\*\[(.*?)\]\*\*/g) || []
  const productNames = matches.map(m => m.replace(/\*\*\[|\]\*\*/g, '').trim())
  
  return ASUKA_PRODUCTS.filter(p => 
    productNames.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
  ).slice(0, 4)
}
