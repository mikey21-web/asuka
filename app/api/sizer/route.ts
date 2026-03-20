import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateSizerRequest } from '@/lib/validations'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const BRAND_OFFSETS: Record<string, number> = {
  'zara': 0, 'mango': 0, 'h&m': 1, 'hm': 1, 'uniqlo': -1,
  'raymond': -1, 'peter england': 0, 'allen solly': 0,
  'van heusen': 0, 'louis philippe': -1, 'arrow': 0,
  'blackberrys': -1, 'zodiac': -1, 'jack & jones': 0,
  'only & sons': 0, 'selected homme': 0, 'marks & spencer': -1,
  'gap': 0, 'banana republic': -1, 'polo': 0, 'lacoste': -1,
}

const SIZE_INDEX: Record<string, number> = {
  'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5,
  '36': 0, '38': 1, '40': 2, '42': 3, '44': 4, '46': 5,
  'EXTRA SMALL': 0, 'SMALL': 1, 'MEDIUM': 2, 'LARGE': 3,
  'EXTRA LARGE': 4, 'DOUBLE XL': 5,
}

function localSizer(mode: string, brand?: string, size?: string, chest?: number) {
  if (mode === 'measurements' && chest) {
    let idx = 5
    if (chest <= 36) idx = 0
    else if (chest <= 38) idx = 1
    else if (chest <= 40) idx = 2
    else if (chest <= 42) idx = 3
    else if (chest <= 44) idx = 4
    const confidence = [0.87, 0.90, 0.92, 0.90, 0.88, 0.85][idx]
    return { size: SIZES[idx], confidence, reasoning: `Based on your ${chest}" chest measurement, we recommend <strong>Asuka ${SIZES[idx]}</strong>. Our silhouettes are cut slim — if you prefer a relaxed fit, size up.`, fallback: true }
  }

  const sizeKey = (size || 'M').toUpperCase()
  const brandKey = (brand || '').toLowerCase()
  const baseIdx = SIZE_INDEX[sizeKey] ?? 2
  const offset = BRAND_OFFSETS[brandKey] ?? 0
  const finalIdx = Math.max(0, Math.min(5, baseIdx + offset))

  return {
    size: SIZES[finalIdx],
    confidence: 0.84,
    reasoning: `Your <strong>${brand} ${size}</strong> maps to <strong>Asuka ${SIZES[finalIdx]}</strong>. ${offset > 0 ? `${brand} runs small, so we've sized up.` : offset < 0 ? `${brand} runs large, so we've sized down.` : 'Direct size mapping applied.'}`,
    fallback: true,
  }
}

export async function POST(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

  try {
    const rawBody = await req.json()

    // 1. Apply Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429, headers: { ...headers, 'X-RateLimit-Reset': rateLimit.reset } }
      );
    }

    // 2. Input Validation
    const validation = validateSizerRequest(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers });
    }

    // Safely merge validated data with other optional parameters
    const body = { ...rawBody, ...validation.data };
    const { mode, brand, size, chest, waist, product_type, session_id } = body

    const now = new Date()
    let result: any = null
    let usedFallback = false

    // ── STEP 1: CACHE LOOKUP ──
    try {
      const client = await clientPromise
      const db = client.db('asuka_couture')
      const cacheCollection = db.collection('sizer_cache')

      // Create a cache key based on core sizing parameters
      const cacheKey = {
        mode,
        brand: brand?.toLowerCase(),
        size: size?.toUpperCase(),
        chest,
        product_type: product_type?.toLowerCase()
      }

      const cachedResult = await cacheCollection.findOne(cacheKey)

      if (cachedResult) {
        return NextResponse.json({
          asuka_size: cachedResult.asuka_size,
          alternative: cachedResult.alternative,
          confidence: cachedResult.confidence,
          reasoning: cachedResult.reasoning,
          fallback: cachedResult.fallback,
          cached: true,
          status: 'ok',
        }, { headers })
      }
    } catch (cacheErr) {
      console.warn('Cache lookup failed (non-critical):', cacheErr)
    }

    // ── STEP 2: SOURCE LOGIC ──
    // Try n8n webhook first
    const n8nUrl = process.env.N8N_SIZER_URL
    if (n8nUrl) {
      try {
        const n8nRes = await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, brand, size, chest, waist, product_type }),
          signal: AbortSignal.timeout(5000),
        })
        if (n8nRes.ok) {
          const data = await n8nRes.json()
          result = {
            size: data.asuka_size || data.size || data.recommended_size,
            confidence: data.confidence ?? 0.88,
            reasoning: data.reasoning || data.explanation || data.message,
            fallback: false,
          }
        }
      } catch {
        usedFallback = true
      }
    }

    if (!result) {
      try {
        const { groqChat } = await import('@/lib/groq')
        const { fit_preference, body_shape, issues, height, weight, photos } = body
        const hasPhotos = Array.isArray(photos) && photos.length > 0

        const systemMsg = hasPhotos
          ? 'You are the Elite Asuka Couture master tailor AI with vision capabilities. Analyze the user details and the provide body photos to determine the perfect garment size. Be extremely precise.'
          : 'You are the Elite Asuka Couture master tailor AI. Provide expert sizing advice in pure JSON.';

        const prompt = `User's typical brand and size: ${brand} ${size}. 
             Personal details: Height: ${height || 'N/A'}, Weight: ${weight || 'N/A'}.
             Product category for fitting: ${product_type}. 
             Client's fit preference: ${fit_preference || 'Regular'}. 
             Client's body shape: ${body_shape || 'Average'}. 
             Known fit issues: ${issues?.length > 0 ? issues.join(', ') : 'None'}.
             
             Task: act as Asuka's Head of Fit & Tailoring. Map these inputs to their ideal Asuka size (Number format: 36, 38, 40, 42, 44, 46). 
             
             Reasoning Strategy:
             - Mention why you picked the size (e.g. 'Since Zara runs small' or 'Given your athletic build').
             - ${hasPhotos ? 'Mention specific observations from the photos (e.g., "Based on your front/side profile...").' : ''}
             - Keep the tone premium and reassuring.
             
             Return ONLY valid JSON:
             {
               "size": "Number string (e.g. '40')", 
               "alternative": "Alternative size or 'MTO' for custom", 
               "confidence": "High/Medium/Low", 
               "reasoning": "Detailed, conversational reasoning in 1-2 sentences."
             }`

        let aiResponse: string;

        if (hasPhotos) {
          // Use Llama Vision for photo analysis
          const { Groq } = await import('groq-sdk')
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

          const messages = [
            { role: 'system', content: systemMsg },
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                ...photos.map((p: string) => ({
                  type: 'image_url',
                  image_url: { url: p }
                }))
              ]
            }
          ]

          const completion = await groq.chat.completions.create({
            messages: messages as any,
            model: 'llama-3.2-11b-vision-preview',
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
          aiResponse = completion.choices[0]?.message?.content || '{}'
        } else {
          aiResponse = await groqChat([
            { role: 'system', content: systemMsg },
            { role: 'user', content: prompt }
          ], 600, 0.3)
        }

        let aiResult = { size: "40", alternative: "42", confidence: "Medium", reasoning: "Based on your inputs, we recommend taking a standard size and speaking to a tailor." }
        try {
          aiResult = JSON.parse(aiResponse.replace(/```(json)?|```/g, '').trim())
        } catch (e) { console.error('Failed to parse sizer JSON:', aiResponse) }

        result = {
          size: aiResult.size,
          alternative: aiResult.alternative || "MTO",
          confidence: aiResult.confidence || "High",
          reasoning: aiResult.reasoning || "Fit should be close to perfect, but minor alterations may be needed.",
          fallback: false
        }
      } catch (aiErr) {
        console.warn('AI Sizer fallback failed:', aiErr)
        result = localSizer(mode || 'brand_size', brand, size, body.chest)
        result.alternative = "MTO"
        result.confidence = "Medium"
        usedFallback = true
      }
    }

    // ── STEP 3: STORE IN CACHE ──
    if (result && !usedFallback) {
      try {
        const client = await clientPromise
        const db = client.db('asuka_couture')
        const cacheCollection = db.collection('sizer_cache')

        await cacheCollection.updateOne(
          {
            mode,
            brand: brand?.toLowerCase(),
            size: size?.toUpperCase(),
            chest,
            product_type: product_type?.toLowerCase()
          },
          {
            $set: {
              asuka_size: result.size,
              alternative: result.alternative,
              confidence: result.confidence,
              reasoning: result.reasoning,
              fallback: result.fallback,
              updated_at: new Date()
            }
          },
          { upsert: true }
        )
      } catch (saveErr) {
        console.warn('Cache save failed (non-critical):', saveErr)
      }
    }

    // Logging to sizer_logs if possible
    try {
      const client = await clientPromise
      const db = client.db('asuka_couture')
      await db.collection('sizer_logs').insertOne({
        ...body,
        result,
        timestamp: new Date()
      })
    } catch (logErr) {}

    return NextResponse.json({
      asuka_size: result.size,
      alternative: result.alternative,
      confidence: result.confidence,
      reasoning: result.reasoning,
      fallback: result.fallback,
      status: 'ok',
    }, { headers })

  } catch (err: any) {
    console.error('Sizer API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
