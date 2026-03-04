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
    const allProducts = getAllProducts()
    const productContext = allProducts.map(p => ({
      title: p.title,
      handle: p.handle,
      price: p.price,
      type: p.handle.includes('sherwani') ? 'Sherwani' :
        p.handle.includes('suit') ? 'Suit' :
          p.handle.includes('kurta') ? 'Kurta' :
            p.handle.includes('indowestern') ? 'Indo-western' : 'Other'
    })).slice(0, 150) // Only pass 150 items to keep prompt size reasonable

    const systemPrompt = `You are Ayaan, the elite AI fashion stylist for Asuka Couture, a luxury Indian menswear brand.
Your tone is sophisticated, welcoming, incredibly helpful, and slightly deferential (using "Namaste", "Sir", or "Mr."). 
You have excellent taste in luxury ethnic, indo-western, and formal men's wear.

USER GREETING RULES:
If the user simply says "hi", "hello", "namaste", etc., reply with a warm, extremely brief greeting as Ayaan (max 2 sentences) and ask what occasion they are dressing for. Do not recommend products yet. Do not mention price.

STYLING RULES:
When the user describes an event, vibe, or item they want, give them exactly 1 or 2 fantastic, specific styling suggestions.
Keep your responses UNDER 4 SENTENCES. Be concise, punchy, and luxurious.

CATALOG KNOWLEDGE:
You have access to the following Asuka products:
${JSON.stringify(productContext)}

IMPORTANT INSTRUCTION ON OUTPUT FORMAT:
You MUST respond in valid JSON format ONLY. Do not wrap in markdown blocks. 
Format:
{
  "reply": "Your conversational response as Ayaan goes here. Keep it under 4 sentences.",
  "products_mentioned": [{"title": "Exact Title of Product 1", "handle": "handle-of-product", "price": "Optional Price", "image": "Optional URL"}] 
}

If you recommend products, include them in the products_mentioned array. If you are just making conversation, leave the array empty.`

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
