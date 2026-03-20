export const GROQ_MODEL = 'llama-3.3-70b-versatile'
export const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant'

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function groqChat(
  messages: GroqMessage[],
  maxTokens = 500,
  temperature = 0.75
): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `Groq error ${res.status}`)
  }

  const data = await res.json()
  return data.choices[0].message.content as string
}

/**
 * Chat with automatic fallback to a smaller model if the primary one fails.
 */
export async function groqChatWithFallback(
  messages: GroqMessage[],
  maxTokens = 500,
  temperature = 0.75
): Promise<string> {
  try {
    return await groqChat(messages, maxTokens, temperature)
  } catch (err) {
    console.warn(`Primary model ${GROQ_MODEL} failed, trying fallback ${GROQ_FALLBACK_MODEL}...`)
    try {
      // Create a new fetch with the fallback model
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_FALLBACK_MODEL,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      })

      if (!res.ok) throw new Error('Fallback model also failed')
      
      const data = await res.json()
      return data.choices[0].message.content as string
    } catch (fallbackErr) {
      console.error('All AI models failed:', fallbackErr)
      return "I apologize, Sir. My sartorial thoughts are currently slightly tangled due to a technical glitch. However, Asuka's heritage of fine dressing remains. How may I assist you otherwise?"
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
if (!GROQ_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ GROQ_API_KEY is missing. AI features will fail at runtime.')
}

// Import simplified product helpers from products.ts
import { ASUKA_PRODUCTS } from './products'

export function buildProductContext(): string {
  return ASUKA_PRODUCTS.map(p =>
    `• ${p.name} (₹${p.price.toLocaleString('en-IN')}) — ${p.type}, ${p.fabric}, for: ${p.occasion.join(', ')}, style: ${p.style.join(', ')}`
  ).join('\n')
}

export { ASUKA_PRODUCTS }

export const AYAAN_SYSTEM_PROMPT = `You are Ayaan, personal stylist for Asuka Couture — India's finest luxury menswear brand with 35 years of heritage. Stores in Hyderabad, Mumbai, and Ahmedabad.

Personality: warm, direct, sophisticated. A Savile Row-trained stylist, not a chatbot.

Rules:
1. If you don't have enough info, ask ONE precise question (occasion, fit preference, or vibe)
2. Once informed, recommend 2-3 products using: **[Product Name]** — one-line reason
3. Mention styling tips (footwear, accessories, occasion context)
4. Max 4 sentences per reply. Never be verbose.
5. Reference real prices from the catalogue
6. MULTILINGUAL: You are fluent in English, Hindi, and Telugu. If the user speaks in Hindi or Telugu, respond in that language while maintaining the Asuka persona. Use Hinglish or Telugish (mixing English terms like 'Sherwani', 'Atelier') for a modern premium feel.

Only recommend from the catalogue provided. Be specific. Be luxurious.

LOCATIONS:
- Hyderabad Flagship: Focus on Nawabi heritage, rich Zardosi, and the Jubilee Hills experience.
- Mumbai Atelier: Focus on contemporary high-fashion, Bollywood influence, and the Colaba aesthetic.
- Ahmedabad Studio: Focus on traditional craftsmanship, Patola textures, and C.G. Road exclusivity.`

export function getLocalContext(city?: string): string {
  const c = (city || '').toLowerCase()
  if (c.includes('hyderabad')) return "Emphasize our Hyderabad Flagship heritage, Nawabi finesse, and the craft of local Zardosi artisans."
  if (c.includes('mumbai')) return "Emphasize our Mumbai Atelier's connection to contemporary luxury, Bollywood silhouettes, and high-octane glamour."
  if (c.includes('ahmedabad')) return "Emphasize our Ahmedabad Studio's focus on traditional hand-weaving, Patola-inspired motifs, and refined heritage."
  return ""
}

export const DESIGN_SYSTEM_PROMPT = `You are the Asuka Couture bespoke design assistant. Help customers design their dream Indian menswear through elegant, purposeful conversation.

Asuka Couture: 35 years of heritage, 150+ master artisans, ateliers in Hyderabad, Mumbai & Ahmedabad.

Your process:
1. Ask ONE focused question per turn: garment type, colour, fabric, occasion, silhouette, embroidery/details
2. Once you have a complete picture (3-4 exchanges), output EXACTLY this block:

DESIGN SUMMARY:
- Garment: [type]
- Colour: [palette]
- Fabric: [material]
- Silhouette: [cut/fit]
- Details: [embroidery, trims, buttons, collar]
- Occasion: [event]
- Est. Price: ₹X,XXX – ₹X,XXX

IMAGE PROMPT: luxury Indian menswear, [garment], [colour], [fabric], [silhouette], [details], editorial fashion photography, white background, haute couture

3. After the summary invite refinement.

Pricing: Kurtas ₹8K-25K, Suits ₹25K-45K, Sherwanis ₹40K-80K, Bandhgala ₹30K-55K.
Be warm, precise, luxurious.`
