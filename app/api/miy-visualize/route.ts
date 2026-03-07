import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.BYTEZ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Bytez API key not configured' }, { status: 500 });
        }

        // Using FLUX.1-dev for highest quality, as requested for luxury fashion
        const response = await fetch('https://api.bytez.com/models/v2/black-forest-labs/FLUX.1-dev', {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: `${prompt}, hyper-realistic luxury Indian couture outfit for men, fashion studio photography, clean neutral background, 8k resolution, cinematic lighting`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Bytez API Error:', errorText);
            return NextResponse.json({ error: 'Failed to generate image' }, { status: response.status });
        }

        const data = await response.json();

        // Bytez returns { output: "base64_string" }
        return NextResponse.json({
            imageUrl: data.output,
            status: 'completed'
        });

    } catch (error) {
        console.error('Visualize Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
