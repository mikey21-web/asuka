import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateMIYVisualizeRequest } from '@/lib/validations';

async function fetchPollinations(prompt: string) {
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1344&nologo=true&seed=${seed}`;
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

        // 2. Input Validation
        const validation = validateMIYVisualizeRequest(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { prompt: rawPrompt } = validation.data!;
        const apiKey = process.env.BYTEZ_API_KEY;

        let prompt = rawPrompt || "Luxury Indian couture ensemble for men";
        if (prompt.toLowerCase().startsWith("generate an image of")) {
            prompt = prompt.substring(20).trim();
        }

        const enhancedPrompt = `Luxury Indian ${prompt}, Asuka Couture heritage style, hyper-realistic, fashion studio photography, clean neutral background, 8k resolution, cinematic lighting, material textures like raw silk and hand embroidery`;
        console.log('Parallel image generation for:', enhancedPrompt);

        const tasks: Promise<{ imageUrl: string, provider: string }>[] = [];

        // Fast, direct task
        tasks.push(fetchPollinations(enhancedPrompt));

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
                provider: result.provider
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
