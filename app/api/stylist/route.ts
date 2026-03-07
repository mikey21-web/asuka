import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'

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

    // Get a tiny subset of the catalog for context (to avoid token limits)
    const allProducts = getAllProducts()
    const productContext = allProducts.slice(0, 70).map(p => {
      const desc = p.description.replace(/<[^>]*>?/gm, '').slice(0, 60)
      return `${p.title}|${p.handle}|${p.price}|${desc}...`
    }).join('\n')

    const systemPrompt = `You are **Ayaan**, the personal AI fashion stylist at Asuka Couture — one of India's most prestigious luxury menswear houses (est. 1991).
    
    BRAND KNOWLEDGE:
    - Established: 1991 (Heritage brand).
    - Craftsmanship: Each piece is handcrafted over 80+ hours using heritage techniques.
    - Physical Stores: Mumbai (Santacruz West), Hyderabad (Banjara Hills), Ahmedabad (Ellisbridge).
    - Shipping: Global shipping. We ship to Delhi, Jaipur, Bangalore, and worldwide.
    - Bespoke: We offer a "Make It Yourself" (MIY) atelier for custom designs.

    PERSONALITY & TONE:
    - Warm, witty, and expert. Like a trusted friend.
    - Keep responses SHORT: 2-3 sentences.
    - Use emojis sparingly.

    PRODUCT RECOMMENDATIONS:
    - ONLY recommend products from the catalog.
    - Explain WHY a piece fits (color, texture, occasion).
    - For customizations or final pricing/discounts, recommend chatting with our team on **WhatsApp (+91 9063356542)**.
    - If user is in Delhi/Jaipur, mention virtual fittings we offer.

    CATALOG (Title|handle|price|description):
    ${productContext}

    RESPONSE FORMAT (JSON):
    {
      "reply": "Your message",
      "products_mentioned": [{"title": "...", "handle": "...", "price": ...}]
    }

    *** CRITICAL GUARDRAILS ***
    Rule 1: If gibberish => "Namaste! I'm here to help you find the perfect luxury outfit. What occasion are you shopping for today?"
    Rule 2: If unrelated to fashion => "Ayaan specializes in luxury menswear and bespoke tailoring at Asuka Couture. How can I dress you today?"`

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
          image_url: fullProd.first_image !== 'NO IMAGE' ? fullProd.first_image : null
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
