import { NextResponse } from 'next/server'
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
    - Propose 2-3 distinct "Look Directions". Each look must have:
        1. A name (e.g. 'The Ivory Rajah', 'Midnight Minimalist').
        2. A concise styling direction.
        3. Specific fabric recommendations (mentioning weights/finishes).
        4. Matching add-ons.
    - catalog_reference: Use the provided catalog for inspiration but feel free to suggest custom tweaks.
    
    RESPONSE JSON LOGIC:
    - 'message': Warm, expert feedback on their vision.
    - 'looks': Array of 2-3 look objects. REQUIRED once preferences are clear.
    - 'image_prompt': A highly detailed stable-diffusion style prompt for Step 4. 
       Format: "luxury [garment type] in [color], [fabric texture], [embroidery details], editorial fashion shoot, studio lighting, 8k".
    
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
