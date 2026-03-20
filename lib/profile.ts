import clientPromise from './mongodb'
import { Groq } from 'groq-sdk'



export interface UserProfile {
  _id: string;           // session_id or user_id
  name?: string;
  preferredSize?: string;
  preferredFabrics?: string[];
  occasions?: string[];
  colorPreferences?: string[];
  budgetRange?: string;
  city?: string;
  lastInteraction?: Date;
  conversationSummary?: string;
}


/**
 * Get user profile by session ID
 */
export async function getProfile(sessionId: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise
    const db = client.db('asuka_couture')
    const profile = await db.collection('user_profiles').findOne({ _id: sessionId as any })
    return profile as UserProfile | null
  } catch (err) {
    console.error('Failed to get profile:', err)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateProfile(sessionId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db('asuka_couture')
    await db.collection('user_profiles').updateOne(
      { _id: sessionId as any },
      { 
        $set: { ...updates, lastInteraction: new Date() },
        $setOnInsert: { _id: sessionId }
      },
      { upsert: true }
    )
  } catch (err) {
    console.error('Failed to update profile:', err)
  }
}

/**
 * Use Groq to extract profile information from chat history
 */
export async function extractProfileFromChat(messages: any[]): Promise<Partial<UserProfile>> {
  if (messages.length < 2) return {}

  const chatTranscript = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n')

  const systemPrompt = `Analyze the following chat transcript between a user and an AI stylist named Ayaan at Asuka Couture.
Extract any personal information mentioned by the user. 

FIELDS TO EXTRACT:
- name: The user's name
- preferredSize: Mentioned clothing size (e.g. S, M, XL, 42)
- preferredFabrics: Fabrics they like (e.g. linen, silk, velvet)
- occasions: Events they are shopping for (e.g. wedding, sangeet, cocktail)
- colorPreferences: Colors they like or asked for
- budgetRange: Any mention of price or budget (e.g. under 50k, 1 lakh)
- summary: A 1-sentence summary of what this user is looking for.

RESPONSE FORMAT (JSON ONLY):
{
  "name": "...",
  "preferredSize": "...",
  "preferredFabrics": ["...", "..."],
  "occasions": ["...", "..."],
  "colorPreferences": ["...", "..."],
  "budgetRange": "...",
  "conversationSummary": "..."
}`

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  })

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `TRANSCRIPT:\n${chatTranscript}` }
      ],
      model: 'llama-3.1-8b-instant', // Fast model for extraction
      temperature: 0,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    
    // Clean up empty fields
    Object.keys(result).forEach(key => {
      if (!result[key] || (Array.isArray(result[key]) && result[key].length === 0)) {
        delete result[key]
      }
    })

    return result
  } catch (err) {
    console.error('Failed to extract profile info:', err)
    return {}
  }
}
