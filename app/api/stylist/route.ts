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
    'Access-Control-Allow-Origin': '*',
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

    // Load full catalog
    const allProducts = getAllProducts()

    // ── STEP 1: DYNAMIC SEARCH ──
    // Instead of simple keyword matching, we'll use a "Shortlist" approach.
    const searchContext = [...(CHAT_HISTORY[sid] || []), { role: 'user', content: message }]
      .map(m => m.content).join(' ').toLowerCase()

    const currentMsgLower = message.toLowerCase()

    // Categorization logic for filtering
    const CATEGORIES = {
      ETHNIC: ['sherwani', 'kurta', 'bundi', 'angrakha', 'bandhgala', 'indowestern', 'stole', 'jutti'],
      WESTERN: ['tuxedo', 'suit', 'jacket', 'shirt', 'blazer', 'pant', 'tie', 'safari', 'linen']
    }

    // Narrow down the catalog to ~200 relevant products to save tokens while keeping "sync"
    let shortlist = allProducts.map(p => {
      let score = 0
      const text = `${p.title} ${p.handle} ${p.description}`.toLowerCase()

      // Primary Keyword Match
      if (currentMsgLower.includes('wedding')) score += text.includes('sherwani') || text.includes('wedding') ? 50 : 0
      if (currentMsgLower.includes('tuxedo')) score += text.includes('tuxedo') ? 100 : 0
      if (currentMsgLower.includes('haldi')) score += text.includes('yellow') || text.includes('kurta') ? 50 : 0

      // Color Match
      const colors = ['blue', 'black', 'white', 'ivory', 'gold', 'red', 'pink', 'green', 'grey', 'beige']
      colors.forEach(c => { if (currentMsgLower.includes(c) && text.includes(c)) score += 30 })

      // General relevance
      const searchTerms = currentMsgLower.split(' ').filter((t: string) => t.length > 3)
      searchTerms.forEach((t: string) => { if (text.includes(t)) score += 10 })

      return { ...p, score }
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 150) // Give the AI 150 products to choose from

    const catalogString = shortlist.map(p => `${p.title}|${p.handle}|${p.price}`).join('\n')

    // ── STEP 2: BRAINY SYSTEM PROMPT ──
    const systemPrompt = `You are **Ayaan**, the distinguished Master Stylist at Asuka Couture. 
    You are NOT just a search bot; you are a fashion consultant for India's elite.
    
    HERITAGE: Asuka Couture (est. 1991) is known for "Rituals of Fine Dressing". 
    We blend ancient Indian craftsmanship with modern silhouettes.
    
    YOUR PERSONALITY:
    - Sophisticated, polite, and authoritative. Use terms like "Sir", "Masterpiece", "Sartorial elegance".
    - You understand human context: "Haldi" needs comfort and bright colors; "Cocktails" need sharp Tuxedos; "Sangeet" is for bold Indowesterns.
    
    YOUR BRAIN (Logic):
    1. UNDERSTAND THE HUMAN: If the user says "I have a wedding", don't just dump products. Ask "Are you the Groom or a Guest?" or "Is it a day or night ceremony?".
    2. SMART RECO: Choose only the TOP 3-5 products that perfectly fit the "vibe".
    3. EXPLAIN THE WHY: For every product mentioned, explain WHY it fits (e.g., "The velvet trim on this Tuxedo adds the right amount of moonlight glow for a reception").
    4. CATEGORY INTEGRITY: Western requests (Tuxedo/Suit) = Western products. Ethnic (Sherwani/Kurta) = Ethnic products.
    
    RESPONSE FORMAT (JSON ONLY):
    {
      "reply": "Your expert style advice (2-3 sentences). Address the user's vibe/concerns.",
      "products_mentioned": [{"title": "...", "handle": "...", "reason": "Why this specific piece?"}]
    }

    CURRENT CATALOG SHORTLIST (Title|Handle|Price):
    ${catalogString}`

    // ── STEP 3: GENERATION ──
    const messages = [
      { role: 'system', content: systemPrompt },
      ...CHAT_HISTORY[sid],
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 800,
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = { reply: "I apologize, Sir. My sartorial thoughts got slightly tangled. Could you rephrase your request?", products_mentioned: [] }
    }

    // Save to history
    CHAT_HISTORY[sid].push({ role: 'user', content: message })
    CHAT_HISTORY[sid].push({ role: 'assistant', content: JSON.stringify(parsedResponse) })
    if (CHAT_HISTORY[sid].length > 10) CHAT_HISTORY[sid] = CHAT_HISTORY[sid].slice(-10)

    // Map back to full product details (images, etc)
    const finalProducts = (parsedResponse.products_mentioned || []).map((p: any) => {
      const fullProd = allProducts.find(f => f.handle === p.handle || f.title === p.title)
      if (fullProd) {
        return {
          ...fullProd,
          recommendation_reason: p.reason
        }
      }
      return null
    }).filter(Boolean)

    return NextResponse.json({
      reply: parsedResponse.reply,
      products_mentioned: finalProducts
    }, { headers })

  } catch (error) {
    console.error('Stylist API Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
