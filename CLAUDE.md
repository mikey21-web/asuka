# Asuka Couture — Claude Code Project
## Built by diyaa.ai

## Project Overview
Full Next.js 14 app — Asuka Couture luxury menswear website with embedded AI features.
Deploy target: Netlify

## Stack
- Next.js 14 (App Router)
- TypeScript
- MongoDB Atlas (Mumbai region)
- Groq API (Llama 3.3 70B)
- Tailwind CSS
- Netlify deployment

## Structure
```
app/
  page.tsx              ← Full Asuka Couture homepage clone
  layout.tsx            ← Fonts (Cormorant Garamond, DM Mono, Outfit) + metadata
  globals.css           ← Design tokens + animations
  api/
    stylist/route.ts    ← Style Yourself chatbot (replaces n8n workflow 1)
    design/route.ts     ← Make It Yourself design chat (replaces n8n workflow 2)
    sizer/route.ts      ← AI Sizer (proxies n8n + local fallback)
    sync/route.ts       ← Product sync Shopify→MongoDB (replaces n8n workflow 3)
    analytics/route.ts  ← Analytics dashboard (replaces n8n workflow 4)
components/
  widget/AIWidget.tsx   ← Floating AI panel (Sizer + Style + Make It)
lib/
  mongodb.ts            ← MongoDB connection
  groq.ts               ← Groq client + prompts + product catalogue
```

## Setup
1. Copy .env.example to .env.local
2. Fill in MONGODB_URI (MongoDB Atlas connection string)
3. GROQ_API_KEY is already set
4. Run: npm install && npm run dev

## Key APIs

### POST /api/stylist
```json
{ "message": "I need a wedding guest outfit", "session_id": "optional" }
→ { "reply": "...", "session_id": "...", "products_mentioned": [] }
```

### POST /api/design
```json
{ "message": "I want a black sherwani", "session_id": "optional" }
→ { "reply": "...", "has_summary": false/true, "design_summary": "...", "brief_id": "..." }
```

### POST /api/sizer
```json
{ "mode": "brand_size", "brand": "Zara", "size": "M", "product_type": "kurta" }
→ { "asuka_size": "L", "confidence": 0.88, "reasoning": "..." }
```

### GET /api/analytics
→ Full dashboard JSON with sizer stats, style sessions, design briefs, 14-day trends

### POST /api/sync
→ Syncs Shopify products to MongoDB (needs SHOPIFY_STORE_URL + SHOPIFY_ADMIN_TOKEN)

## Vercel Deployment
1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add all env vars from .env.example in Vercel → Project Settings → Environment Variables
4. Deploy — vercel.json handles the rest

## MongoDB Collections
- sizer_logs
- style_sessions
- style_messages
- asuka_products
- design_briefs
- analytics_events

## Groq Model
llama-3.3-70b-versatile (latest, replaces decommissioned llama-3.1-70b-versatile)
