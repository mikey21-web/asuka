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

        const systemPrompt = `You are the Elite Bespoke Master Tailor for Asuka Couture. 
The user is going through a guided "Make-It-Yourself" flow to design a custom outfit.

USER INPUTS SO FAR:
${JSON.stringify(inputs)}

ASUKA PRODUCT CATALOG(For Visual Reference):
${JSON.stringify(simplifiedCatalog)}

YOUR OBJECTIVE:
When the user speaks to you, respond as a master tailor.You must ALWAYS reply in pure JSON format.
Your JSON must strictly match this structure:
{
    "looks": [
        {
            "name": "Name of the Look (e.g., The Midnight Starlit Tuxedo)",
            "direction": "A short 1-2 sentence description of the vibe and cut",
            "fabric_notes": "Suggested fabric & finish (e.g. Italian Wool with Satin peak lapels)",
            "addons": ["Black Silk Bow Tie", "Patent Leather Oxfords", "Onyx Cufflinks"],
            "image_url": "YOU MUST SELECT AN EXACT image URL from the ASUKA PRODUCT CATALOG provided above that most closely visually matches this look. DO NOT INVENT URLS."
        }
    ],
        "message": "A short, sophisticated conversational reply acknowledging their request and presenting the looks. Max 2 sentences."
}

Give 2 to 3 looks maximum.Offer distinct but relevant options based on their inputs.
    For 'image_url', you must pick an actual 'img' string from the catalog list above that fits the vibe / color of your look.
Only output the JSON object.Do not wrap in markdown tags or add any other text.`

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
