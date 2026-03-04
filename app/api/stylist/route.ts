import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Store a simple in-memory chat history for demo purposes
// In production, this should use a database (Redis/Postgres) keyed by session_id
const CHAT_HISTORY: Record<string, any[]> = {}

export async function POST(req: Request) {
  try {
    const { message, session_id } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const sid = session_id || 'default_session'
    if (!CHAT_HISTORY[sid]) {
      CHAT_HISTORY[sid] = []
    }

    // Get a tiny subset of the catalog for context (to avoid token limits)
    // Slim product context for lower token usage: only title, handle, price
    const allProducts = getAllProducts()
    const productContext = allProducts.slice(0, 80).map(p => `${p.title}|${p.handle}|${p.price}`).join('\n')

    const systemPrompt = `You are **Ayaan**, the personal AI fashion stylist at Asuka Couture — one of India's most prestigious luxury menswear houses (est. 1991).

PERSONALITY & TONE:
- Warm, witty, and genuinely helpful — like a trusted friend who happens to be a fashion expert
- Use "Namaste" for first greeting only. After that, be natural and conversational
- Sprinkle in light humor and genuine excitement about fashion
- Never sound robotic, salesy, or like a chatbot. Sound like a real luxury stylist texting a client
- Keep responses SHORT: 2-3 sentences max for casual chat, 3-4 for recommendations
- Use emojis sparingly (max 1-2 per message) — keep it classy

MEMORY & CONTEXT:
- You have FULL conversation history. Reference what the user said earlier naturally
- If they mentioned an occasion, remember it. If they liked a color, remember it
- Build on previous suggestions — "Since you loved that sapphire blue, you might also love..."
- Ask follow-up questions to narrow down: budget range, event date, color preferences


PRODUCT RECOMMENDATIONS:
- You have access to Asuka's REAL catalog below. ONLY recommend products that exist
- When recommending, mention 1-2 products max per message. Don't overwhelm
- Explain WHY each product fits their need — occasion, body type, vibe
- Include price naturally: "The **Royal Navy Bandhgala** at ₹24,990 would be stunning for your reception"
- Always suggest complementary accessories or styling tips

CATALOG (format: Title|handle|price per line):
${productContext}

RESPONSE FORMAT (MUST be valid JSON, no markdown wrapping):
{
  "reply": "Your conversational response. Be warm and specific.",
  "products_mentioned": [{"title": "Exact Product Title", "handle": "product-handle", "price": 24990, "image_url": "optional"}]
}

If just chatting (no product suggestion needed), use empty array for products_mentioned.

*** CRITICAL GUARDRAILS — YOU MUST FOLLOW THESE STRICTLY ***
Rule 1: If the user's message is gibberish (e.g., "ajksdhfg", "adsfasdf", "test1234") or nonsensical:
=> Your JSON "reply" MUST exactly be: "I apologize, but I didn't quite catch that. I am here to help you style your perfect outfit. Could you tell me what occasion you are dressing for?"

Rule 2: If the user's message is completely unrelated to clothing, fashion, tailoring, or Asuka Couture (e.g. coding, math, politics):
=> Your JSON "reply" MUST exactly be: "As the Asuka Couture stylist, I only specialize in luxury menswear and bespoke tailoring. How can I help you elevate your wardrobe today?"`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...CHAT_HISTORY[sid],
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
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
    })

  } catch (error) {
    console.error('Stylist API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
