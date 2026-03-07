import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { Groq } from 'groq-sdk'
import { getAllProducts, type CatalogProduct } from '@/lib/catalog'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Store a simple in-memory chat history for demo purposes
// In production, this should use a database (Redis/Postgres) keyed by session_id
const CHAT_HISTORY: Record<string, any[]> = {}

export async function POST(req: Request) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Replace with client's shopify domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const { message, session_id } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const sid = session_id || 'default_session'
    if (!CHAT_HISTORY[sid]) {
      CHAT_HISTORY[sid] = []
    }

    // Get the full catalog
    const allProducts = getAllProducts()

    // NEW: Relevance-based product retrieval
    const searchContext = [...(CHAT_HISTORY[sid] || []), { role: 'user', content: message }]
      .map(m => {
        if (m.role === 'assistant') {
          try {
            const parsed = JSON.parse(m.content)
            return parsed.reply || m.content
          } catch {
            return m.content
          }
        }
        return m.content
      })
      .join(' ').toLowerCase()

    // Detect focus categories in current message vs history
    const currentMsgLower = message.toLowerCase()

    // Define Category Groups
    const CATEGORY_GROUPS = {
      ETHNIC: ['sherwani', 'kurta', 'bundi', 'angrakha', 'bandhgala', 'indowestern', 'stole', 'jutti'],
      WESTERN: ['tuxedo', 'suit', 'jacket', 'shirt', 'blazer', 'pant', 'tie']
    }

    // Logic to determine user's current intent
    const hasTuxedo = currentMsgLower.includes('tuxedo')
    const hasSuit = currentMsgLower.includes('suit') && !currentMsgLower.includes('indowestern')
    const hasWesternIntent = hasTuxedo || hasSuit || ['blazer', 'shirt'].some(k => currentMsgLower.includes(k))
    const hasEthnicIntent = CATEGORY_GROUPS.ETHNIC.some(k => currentMsgLower.includes(k))

    let productsForContext = allProducts
      .map((p: CatalogProduct) => {
        let score = 0
        const title = p.title.toLowerCase()
        const handle = p.handle.toLowerCase()
        const desc = (p.description || '').toLowerCase()
        const pText = `${title} ${handle} ${desc}`

        // 1. HARD FILTER: Category Enforcement
        if (hasTuxedo && !title.includes('tuxedo')) score -= 200
        if (hasWesternIntent && (title.includes('sherwani') || title.includes('kurta') || title.includes('bundi'))) score -= 500
        if (hasEthnicIntent && (title.includes('tuxedo') || (title.includes('suit') && !title.includes('indowestern')))) score -= 500

        // 2. PRIMARY KEYWORD BOOST (Current Message)
        const activeCategories = [...CATEGORY_GROUPS.ETHNIC, ...CATEGORY_GROUPS.WESTERN]
        activeCategories.forEach(cat => {
          if (currentMsgLower.includes(cat)) {
            if (title.includes(cat)) score += 100 // Massive boost for specific category
            else if (desc.includes(cat)) score += 40
          }
        })

        // 3. COLOR MATCH (Current Message)
        const colors = ['blue', 'black', 'white', 'ivory', 'gold', 'red', 'pink', 'green', 'grey', 'maroon', 'beige', 'peach', 'ocean']
        colors.forEach(col => {
          if (currentMsgLower.includes(col)) {
            if (title.includes(col)) score += 30
            else if (desc.includes(col)) score += 10
          }
        })

        // 4. OCCASION MATCH (Full Conversation History)
        const occasions = ['wedding', 'sangeet', 'haldi', 'mehendi', 'cocktail', 'party', 'reception', 'formal', 'casual']
        occasions.forEach(occ => {
          if (searchContext.includes(occ)) {
            if (title.includes(occ) || desc.includes(occ)) score += 20
          }
        })

        // 5. WORD MATCH
        const words = currentMsgLower.split(/\s+/).filter((w: string) => w.length > 3)
        words.forEach((word: string) => {
          if (title.includes(word)) score += 10
        })

        return { ...p, score }
      })
      .filter(p => p.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 60)

    // Fallback: If no strong matches, include some best-sellers/new-arrivals from top of list
    if (productsForContext.length < 15) {
      const topProducts = allProducts.slice(0, 40)
      const existingHandles = new Set(productsForContext.map(p => p.handle))
      topProducts.forEach(p => {
        if (!existingHandles.has(p.handle) && productsForContext.length < 60) {
          productsForContext.push({ ...p, score: 0 })
        }
      })
    }

    const productContext = productsForContext.map(p => {
      const desc = p.description.replace(/<[^>]*>?/gm, '').slice(0, 70)
      return `${p.title}|${p.handle}|${p.price}|${desc}...`
    }).join('\n')

    const systemPrompt = `You are **Ayaan**, the personal AI fashion stylist at Asuka Couture — India's prestigious luxury menswear house.
    
    CRITICAL INSTRUCTION:
    - CATEGORY INTEGRITY: If a user asks for Western wear (Tuxedo, Suit, Jacket), ONLY suggest from that category. NEVER suggest Sherwanis or Kurtas if a Tuxedo is requested.
    - If you cannot find a direct match for the requested category in the CATALOG below, apologize and suggest the closest luxury Western alternative (e.g., a Black Suit if no Tuxedo).
    - DO NOT mix Indian Ethnic wear into a Western request unless explicitly asked for "Indowestern".

    BRAND KNOWLEDGE:
    - Heritage brand since 1991. Physical stores: Mumbai, Hyderabad, Ahmedabad.
    - We ship to Delhi, Bangalore, Jaipur, and worldwide. Suggest Zoom fittings.

    PERSONALITY:
    - Luxury connoisseur. Short, expert responses (max 3 sentences).

    RESPONSE FORMAT (JSON):
    {
      "reply": "Expert advice based on the user's specific request",
      "products_mentioned": [{"title": "...", "handle": "...", "price": ...}]
    }

    CATALOG (Title|handle|price|description):
    ${productContext}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...CHAT_HISTORY[sid],
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = { reply: "I apologize, sir. I had a momentary lapse. Could you repeat that?", products_mentioned: [] }
    }

    // Save to history (keep last 6 turns to avoid context bloat)
    CHAT_HISTORY[sid].push({ role: 'user', content: message })
    CHAT_HISTORY[sid].push({ role: 'assistant', content: JSON.stringify(parsedResponse) })
    if (CHAT_HISTORY[sid].length > 12) {
      CHAT_HISTORY[sid] = CHAT_HISTORY[sid].slice(-12)
    }

    // Enhance the products with images from the real catalog before returning
    const finalProducts = (parsedResponse.products_mentioned || []).map((p: any) => {
      const fullProd = allProducts.find(full => full.handle === p.handle || full.title === p.title)
      if (fullProd) {
        return {
          title: fullProd.title,
          handle: fullProd.handle,
          price: fullProd.price,
          first_image: fullProd.first_image !== 'NO IMAGE' ? fullProd.first_image : null
        }
      }
      return p
    })

    return NextResponse.json({
      reply: parsedResponse.reply,
      products_mentioned: finalProducts
    }, { headers })

  } catch (error) {
    console.error('Stylist API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
