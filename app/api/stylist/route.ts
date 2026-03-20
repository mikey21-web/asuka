import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { Groq } from 'groq-sdk'
import { getProductsFromDB, type CatalogProduct } from '@/lib/catalog'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateStylistRequest } from '@/lib/validations'
import { getProfile, updateProfile, extractProfileFromChat } from '@/lib/profile'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Store a simple in-memory chat history for demo purposes
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
    const rawBody = await req.json()

    // 1. Apply Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429, headers: { ...headers, 'X-RateLimit-Reset': rateLimit.reset } }
      );
    }

    // 2. Input Validation
    const validation = validateStylistRequest(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers });
    }

    const { message, session_id, location } = validation.data!;
    const sid = session_id || 'default_session'

    // 3. Load User Profile
    const userProfile = await getProfile(sid)
    
    // Hyper-local personality
    const { getLocalContext } = await import('@/lib/groq');
    const localContext = getLocalContext(location || userProfile?.city);

    const profileContext = userProfile ? `
    USER PROFILE:
    - Name: ${userProfile.name || 'Unknown'}
    - Preferred Size: ${userProfile.preferredSize || 'Unknown'}
    - Preferred Fabrics: ${userProfile.preferredFabrics?.join(', ') || 'Unknown'}
    - Past Occasions: ${userProfile.occasions?.join(', ') || 'Unknown'}
    - Style Summary: ${userProfile.conversationSummary || 'New customer'}
    - Detected Location: ${location || userProfile.city || 'Unknown'}
    ${localContext}
    ` : `USER PROFILE: New customer. Greet them warmly and learn their style. ${localContext}`


    if (!CHAT_HISTORY[sid]) {
      CHAT_HISTORY[sid] = []
    }

    // Load live catalog from DB
    const allProducts = await getProductsFromDB()

    // ── STEP 1: DYNAMIC SEARCH ──
    const currentMsgLower = message.toLowerCase()

    let shortlist = allProducts.map(p => {
      let score = 0
      const text = `${p.title} ${p.handle} ${p.description}`.toLowerCase()

      // Primary Keyword Match
      if (currentMsgLower.includes('wedding')) score += text.includes('sherwani') || text.includes('wedding') ? 50 : 0
      if (currentMsgLower.includes('tuxedo')) score += text.includes('tuxedo') ? 100 : 0
      if (currentMsgLower.includes('haldi')) score += text.includes('yellow') || text.includes('kurta') ? 50 : 0

      // Profile Matching
      if (userProfile?.preferredFabrics?.some(f => text.includes(f.toLowerCase()))) score += 40
      if (userProfile?.colorPreferences?.some(c => text.includes(c.toLowerCase()))) score += 40

      return { ...p, score }
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 150)

    // ── STEP 2: BRAINY SYSTEM PROMPT ──
    const systemPrompt = `You are **Ayaan**, the distinguished Master Stylist at Asuka Couture. 
    You are NOT just a search bot; you are a fashion consultant for India's elite.
    
    HERITAGE: Asuka Couture (est. 1991) is known for "Rituals of Fine Dressing". 
    We blend ancient Indian craftsmanship with modern silhouettes.

    ${profileContext}
    
    YOUR PERSONALITY:
    - Sophisticated, polite, and authoritative. Use terms like "Sir", "Masterpiece", "Sartorial elegance".
    - If you know the user's name, greet them by name (e.g., "Good evening, Mr. Arjun").
    - You understand human context: "Haldi" needs comfort and bright colors; "Cocktails" need sharp Tuxedos.
    
    YOUR BRAIN (Logic):
    1. PERSISTENCE: Acknowledge what you already know about them (e.g. "Since you preferred Linen for your last event...").
    2. SMART RECO: Choose only the TOP 3-5 products that perfectly fit the "vibe".
    3. INVENTORY AWARENESS: Only recommend products that are IN STOCK. 
       - If a product has <3 units left in a size, mention: "Only {X} pieces left in your size" to create urgency.
    4. EXPLAIN THE WHY: For every product mentioned, explain WHY it fits.
    
    RESPONSE FORMAT (JSON ONLY):
    {
      "reply": "Your expert style advice (2-3 sentences). Address the user's vibe/concerns.",
      "products_mentioned": [{"title": "...", "handle": "...", "reason": "Why this specific piece?"}]
    }

    CURRENT CATALOG SHORTLIST (Title|Handle|Price|Stock):
    ${shortlist.map(p => {
      const stockInfo = (p.variants || [])
        .map(v => `${v.title}:${v.inventory_quantity}`)
        .join(', ');
      return `${p.title}|${p.handle}|${p.price}|Stock:[${stockInfo || 'Out of Stock'}]`;
    }).join('\n')}`

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
    }).catch(async () => {
       return await groq.chat.completions.create({
         messages: messages as any,
         model: 'llama-3.1-8b-instant',
         temperature: 0.6,
         max_tokens: 800,
         response_format: { type: "json_object" }
       })
    })

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = { reply: "I apologize, Sir. My sartorial thoughts got slightly tangled.", products_mentioned: [] }
    }

    // Save to history
    CHAT_HISTORY[sid].push({ role: 'user', content: message })
    CHAT_HISTORY[sid].push({ role: 'assistant', content: JSON.stringify(parsedResponse) })
    if (CHAT_HISTORY[sid].length > 10) CHAT_HISTORY[sid] = CHAT_HISTORY[sid].slice(-10)

    // ── STEP 4: BACKGROUND PROFILE UPDATE ──
    // In a real serverless env, this might need to be awaited or handled via a queue
    (async () => {
      const extracted = await extractProfileFromChat(CHAT_HISTORY[sid])
      if (Object.keys(extracted).length > 0) {
        await updateProfile(sid, extracted)
      }
    })().catch(console.error)

    // ── STEP 5: MAPPING & COMPLEMENTARY ──
    const finalProducts = (parsedResponse.products_mentioned || []).map((p: any) => {
      const fullProd = allProducts.find(f => f.handle === p.handle || f.title === p.title)
      if (fullProd) {
        return { ...fullProd, recommendation_reason: p.reason }
      }
      return null
    }).filter(Boolean)

    const { getCompleteLook } = await import('@/lib/styling-graph');
    let complementaryProducts: any[] = [];
    if (finalProducts.length > 0) {
      const topProduct = finalProducts[0] as any;
      complementaryProducts = await getCompleteLook(topProduct.handle);
    }

    return NextResponse.json({
      reply: parsedResponse.reply,
      products_mentioned: finalProducts,
      complementary: complementaryProducts
    }, { headers })


  } catch (error) {
    console.error('Stylist API Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
