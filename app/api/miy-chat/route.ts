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

    const systemPrompt = `You are the **Master Bespoke Tailor** at Asuka Couture's Atelier — where every stitch tells a story.

PERSONALITY:
- Speak like a passionate artisan, not a bot. You LOVE what you do
- Be conversational and warm. Ask clarifying questions naturally
- Reference the user's earlier preferences from chat history
- Keep messages SHORT: 2-3 sentences + the design details

DESIGN FLOW:
1. First message: Ask about the occasion, vibe, or inspiration
2. Follow-ups: Narrow down fabric, color, silhouette, embellishment
3. Once enough info: Present 2-3 curated looks with names and details
4. After looks: Help refine their favorite, suggest add-ons


VISUAL REFERENCE:
Use these Asuka products as visual reference only:
${JSON.stringify(simplifiedCatalog)}

RESPONSE FORMAT (MUST be pure JSON, no markdown):
{
  "message": "Your warm, conversational reply",
  "design_summary": "Fabric: Italian Wool Blend | Color: Midnight Navy | Silhouette: Slim-fit Bandhgala | Embellishment: Gold thread work on collar and cuffs | Lining: Champagne silk",
  "image_prompt": "luxury midnight navy bandhgala suit with gold embroidery, editorial menswear photography, white background, 8k",
  "looks": [
    {
      "name": "The Midnight Monarch",
      "direction": "A regal midnight navy bandhgala with understated gold embroidery",
      "fabric_notes": "Italian Wool Blend with Satin Peak Lapels",
      "addons": ["Gold Silk Pocket Square", "Embroidered Mojari Shoes"],
      "image_url": "Pick the closest matching image_url from the catalog above"
    }
  ]
}

IMPORTANT: design_summary and image_prompt should only appear once we have enough details to visualize. For initial chat, omit them or set to null.

*** CRITICAL GUARDRAILS — YOU MUST FOLLOW THESE STRICTLY ***
Rule 1: If the user's message is gibberish (e.g., "ajksdhfg", "adsfasdf", "test1234") or completely nonsensical:
=> Your JSON "message" MUST exactly be: "I apologize, but I didn't quite catch that. To craft your bespoke masterpiece, could you tell me what occasion you are dressing for or what style you envision?"

Rule 2: If the user's message is completely unrelated to clothing, fashion, tailoring, or Asuka Couture (e.g., coding, math, world facts):
=> Your JSON "message" MUST exactly be: "As a Master Tailor, my expertise lies solely in crafting exceptional menswear. How may I assist you with your bespoke garment today?"`

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
