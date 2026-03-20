import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateMIYChatRequest } from '@/lib/validations'
import { Groq } from 'groq-sdk'
import { getAllProducts } from '@/lib/catalog'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    // 1. Apply Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429, headers: { 'X-RateLimit-Reset': rateLimit.reset } }
      );
    }

    const { message: rawMessage, inputs, history: rawHistory } = await req.json()
    
    // 2. Input Validation
    const validation = validateMIYChatRequest({ message: rawMessage, inputs, history: rawHistory });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { message, history } = validation.data!;
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
    - KEY MARKETS (Virtual & Bespoke): We have a massive clientele in **Delhi**, Jaipur, Bangalore, and Dubai.
    - DELHI SERVICES: For clients in **Delhi**, we offer dedicated virtual measurement sessions and home-measured kits via courier. We ship to Delhi daily.
    - Craftsmanship: Each piece is handcrafted over 80+ hours using heritage techniques.

    YOUR GOAL:
    - Listen to their vision (occasion, mood, budget).
    - **PROACTIVE DESIGN**: Don't wait for them to provide every detail. Based on their inputs, proactively suggest specific fabrics (e.g., Silk Velvet, Italian Wool, Brocade), embroidery styles (e.g., Zardosi, Threadwork), and silhouette details (e.g., Asymmetric cuts, Double-breasted).
    - Acknowledge their city (especially if it's Delhi or Jaipur) and inputs (height, weight, etc.) naturally to build rapport.
    - Reassure them that while we aren't physically in Delhi yet, our virtual fitting process for global clients is flawless.
    - For customizations, pricing, or to speak to a human, refer them to **WhatsApp (+91 9063356542)**.
    - Propose 2-3 distinct "Look Directions" based on the catalog references below. Each look must follow this strict schema:
        { "name": string, "direction": string, "fabric_notes": string, "addons": string[] }
    
    RESPONSE JSON LOGIC:
    - Return ONLY a valid JSON object.
    - 'message': Warm, expert feedback. Be specific and opinionated about what looks good. Mention WhatsApp for the final step.
    - 'looks': Array of the look objects.
    - 'image_prompt': A highly detailed IMAGE GENERATION prompt for Step 4. Include specific textures.
    
    CATALOG REFERENCES (for inspiration):
    ${JSON.stringify(simplifiedCatalog)}
    
    *** CRITICAL GUARDRAILS ***
    Rule 1: If gibberish => Ask for the occasion politely.
    Rule 2: NEVER mention you are an AI. You are a Master Tailor.
    Rule 3: Do not hallucinate stores. We are only in Mumbai, Hyderabad, and Ahmedabad. Delhi is virtual/shipping only.`

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
