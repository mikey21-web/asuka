import { NextRequest, NextResponse } from 'next/server';

// This is a simulation of a lead database connection
// In production, you would connect to MongoDB or a CRM here.
export async function POST(req: NextRequest) {
    try {
        const lead = await req.json();
        // Pointing to your n8n leads webhook (or environment variable)
        const n8nWebhookUrl = process.env.N8N_LEADS_URL || 'https://n8n.diyaaaa.in/webhook-test/asuka-miy-leads';

        // Log to the server console (visible in Vercel logs)
        console.log('--- NEW BESPOKE LEAD CAPTURED ---');
        console.log('NAME:', lead.name);
        console.log('CONTACT:', lead.contact);
        console.log('OCCASION:', lead.occasion);
        console.log('TIMESTAMP:', new Date().toISOString());
        console.log('--------------------------------');

        // Forward to n8n for Google Sheets push
        try {
            await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...lead,
                    source: 'MIY Atelier Web',
                    archivedAt: new Date().toISOString()
                })
            });
            console.log('Lead successfully synced to n8n.');
        } catch (webhookError) {
            console.error('n8n Sync Error:', webhookError);
        }

        return NextResponse.json({
            success: true,
            message: 'Lead archived successfully'
        });

    } catch (error) {
        console.error('Lead Capture Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
