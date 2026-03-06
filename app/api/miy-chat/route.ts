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
      image_url: p.first_image
    }))

    const systemPrompt = `You are the **Head of Bespoke Design** at Asuka Couture's Atelier. 
    
    GUIDED DESIGN PROTOCOL:
    - Persona: Passionate Indian artisan. Sophisticated, warm, and expert.
    - Context: The client is using a guided 5-step flow. You are Step 3: The Conversational Curator.
    
    YOUR GOAL:
    - Listen to their vision (occasion, mood, budget).
    - Propose 2-3 distinct "Look Directions". Each look must follow this strict schema:
        { "name": string, "direction": string, "fabric_notes": string, "addons": string[] }
    - catalog_reference: Use the provided simplified catalog for inspiration.
    
    RESPONSE JSON LOGIC:
    - Return ONLY a valid JSON object. No preamble.
    - 'message': Warm, expert feedback on their vision.
    - 'looks': Array of the look objects defined above (ONLY provide once preferences are clear).
    - 'image_prompt': A highly detailed IMAGE GENERATION prompt for Step 4. 
       Format: "Professional fashion photography of a [garment type] in [color], [fabric texture], [embroidery details], luxury studio lighting, editorial style, 8k".
    
    CATALOG REFERENCES:
    ${JSON.stringify(simplifiedCatalog)}
    
    *** CRITICAL GUARDRAILS ***
    Rule 1: If gibberish => Ask for the occasion/vibe politely.
    Rule 2: If non-fashion => Politely decline and return to tailoring.
    Rule 3: NEVER mention you are an AI. You are a Master Tailor.`

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
