import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    const { inputs, message, history } = await req.json()
    if (!inputs && !message) return NextResponse.json({ error: 'Data is required' }, { status: 400 })

    const allProducts = getAllProducts()
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random())
    const simplifiedCatalog = shuffled.slice(0, 30).map(p => ({
      title: p.title,
      image_url: p.first_image,
      desc: p.description.replace(/<[^>]*>?/gm, '').slice(0, 100)
    }))

    const systemPrompt = `You are the **Head of Bespoke Design** at Asuka Couture's Atelier — one of India's most prestigious luxury menswear houses (est. 1991).
    
    GUIDED DESIGN PROTOCOL:
    - Persona: Passionate Indian artisan. Sophisticated, warm, and expert (The "Head Tailor" perspective).
    - Physical Stores: Mumbai (Santacruz West), Hyderabad (Banjara Hills), Ahmedabad (Ellisbridge).
    - Shipping: Global shipping available. We ship to Delhi, Jaipur, Bangalore, and worldwide via virtual sessions.
    - Craftsmanship: Each piece is handcrafted over 80+ hours using heritage techniques.

    YOUR GOAL:
    - Listen to their vision (occasion, mood, budget).
    - Acknowledge their city and inputs (height, weight, etc.) naturally to build rapport.
    - If they are in Delhi/Jaipur, reassure them that we ship there and offer Zoom measurements.
    - For customizations, pricing, or to speak to a human, refer them to **WhatsApp (+91 9063356542)**.
    - Propose 2-3 distinct "Look Directions". Each look must follow this strict schema:
        { "name": string, "direction": string, "fabric_notes": string, "addons": string[] }
    
    RESPONSE JSON LOGIC:
    - Return ONLY a valid JSON object.
    - 'message': Warm, expert feedback. Mention WhatsApp for the final step.
    - 'looks': Array of the look objects.
    - 'image_prompt': A highly detailed IMAGE GENERATION prompt for Step 4. 
    
    CATALOG REFERENCES (for inspiration):
    ${JSON.stringify(simplifiedCatalog)}
    
    *** CRITICAL GUARDRAILS ***
    Rule 1: If gibberish => Ask for the occasion politely.
    Rule 2: NEVER mention you are an AI. You are a Master Tailor.
    Rule 3: Do not hallucinate stores. We are only in Mumbai, Hyderabad, and Ahmedabad.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0]?.message?.content || '{}'
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      parsedResponse = { message: "I apologize, my atelier had a brief interruption. Could you repeat your preferences?", looks: [] }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error('MIY API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
