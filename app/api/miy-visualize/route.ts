import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateMIYVisualizeRequest } from '@/lib/validations';

type QualityMode = 'fast' | 'enhanced';
type GarmentType = 'sherwani' | 'bandhgala' | 'kurta' | 'suit' | 'general';

function normalizeQualityMode(value: unknown): QualityMode {
    return value === 'enhanced' ? 'enhanced' : 'fast';
}

function normalizeGarmentType(value: unknown, prompt: string): GarmentType {
    const fromInput = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (fromInput === 'sherwani' || fromInput === 'bandhgala' || fromInput === 'kurta' || fromInput === 'suit') {
        return fromInput;
    }

    const p = prompt.toLowerCase();
    if (p.includes('sherwani')) return 'sherwani';
    if (p.includes('bandhgala') || p.includes('nehru')) return 'bandhgala';
    if (p.includes('kurta')) return 'kurta';
    if (p.includes('suit') || p.includes('tuxedo') || p.includes('blazer')) return 'suit';
    return 'general';
}

function hashToSeed(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 1000000;
}

function buildPrompt(basePrompt: string, garmentType: GarmentType, qualityMode: QualityMode): string {
    const garmentDirectives: Record<GarmentType, string> = {
        sherwani: 'regal sherwani silhouette, handcrafted zardozi and threadwork balance, wedding couture drape',
        bandhgala: 'structured bandhgala posture, sharp collar architecture, ceremonial modern Indian tailoring',
        kurta: 'elevated kurta set proportions, luxury festive textile detailing, clean heritage styling',
        suit: 'luxury tailored suit lines, precise shoulder structure, couture menswear finishing',
        general: 'luxury Indian couture menswear silhouette, high-end atelier detailing',
    };

    const qualityDirective = qualityMode === 'enhanced'
        ? 'ultra detailed textile rendering, crisp edge definition, editorial-grade styling consistency, premium studio composition'
        : 'clean composition, fast stylist concept render, strong silhouette readability';

    return [
        `Luxury Indian ${basePrompt}`,
        garmentDirectives[garmentType],
        'Asuka Couture heritage aesthetic, neutral studio background, cinematic soft lighting',
        qualityDirective,
    ].join(', ');
}

async function fetchPollinations(prompt: string, seed: number, qualityMode: QualityMode) {
    const width = qualityMode === 'enhanced' ? 1024 : 768;
    const height = qualityMode === 'enhanced' ? 1344 : 1024;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
    console.log('Sending Pollinations request...');
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Pollinations status: ${response.status}`);
    return { imageUrl: url, provider: 'pollinations' };
}

async function fetchBytez(prompt: string, apiKey: string) {
    console.log('Sending Bytez request...');
    const response = await fetch('https://api.bytez.com/models/v2/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),
        signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) throw new Error(`Bytez status: ${response.status}`);
    const data = await response.json();
    if (!data.output) throw new Error("Bytez failed to return output");
    return { imageUrl: data.output, provider: 'bytez' };
}

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

        const body = await req.json();
        const { qualityMode: rawQualityMode, seed: rawSeed, garmentType: rawGarmentType } = body as {
            qualityMode?: unknown;
            seed?: unknown;
            garmentType?: unknown;
        };

        // 2. Input Validation
        const validation = validateMIYVisualizeRequest(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { prompt: rawPrompt } = validation.data!;
        const apiKey = process.env.BYTEZ_API_KEY;
        const qualityMode = normalizeQualityMode(rawQualityMode);

        let prompt = rawPrompt || "Luxury Indian couture ensemble for men";
        if (prompt.toLowerCase().startsWith("generate an image of")) {
            prompt = prompt.substring(20).trim();
        }

        const garmentType = normalizeGarmentType(rawGarmentType, prompt);
        const seed = typeof rawSeed === 'number' && Number.isFinite(rawSeed)
            ? Math.abs(Math.floor(rawSeed)) % 1000000
            : hashToSeed(`${prompt}:${garmentType}`);

        const enhancedPrompt = buildPrompt(prompt, garmentType, qualityMode);
        console.log('Parallel image generation for:', enhancedPrompt);

        const tasks: Promise<{ imageUrl: string, provider: string }>[] = [];

        // Fast, direct task
        tasks.push(fetchPollinations(enhancedPrompt, seed, qualityMode));

        // High quality fallback/parallel task
        if (apiKey) {
            tasks.push(fetchBytez(enhancedPrompt, apiKey));
        }

        try {
            // First to succeed wins!
            const result = await Promise.any(tasks);
            console.log(`Image generation succeeded via ${result.provider}`);
            return NextResponse.json({
                imageUrl: result.imageUrl,
                status: 'completed',
                provider: result.provider,
                seed,
                qualityMode,
                garmentType,
            });
        } catch (aggError) {
            console.error('All image generation providers failed', aggError);
            return NextResponse.json({ error: 'Failed to generate image from all providers' }, { status: 500 });
        }

    } catch (error) {
        console.error('Visualize Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
