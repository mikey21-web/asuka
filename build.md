# Asuka Couture — AI Features Build Plan
> Drop this file in your project root and use it with Claude Code or Cursor to build everything phase by phase.

---

## Current Stack
- Next.js 14 (App Router)
- TypeScript
- MongoDB Atlas (Mumbai)
- Groq API (Llama 3.3 70B)
- Tailwind CSS
- Vercel deployment

---

## PHASE 1 — Bug Fixes + Quick Wins
> Estimated time: 3–5 days | Do this first before adding anything new

### 1.1 Fix the floating widget "1" badge bug
**File:** `components/widget/AIWidget.tsx`
- The notification badge is showing a hardcoded "1" permanently
- Fix: Only show badge if there are actual unread messages, default to hidden
- The badge count should reset to 0 when the widget is opened

### 1.2 Fix AI Stylist page — chat not rendering
**File:** `app/ai-stylist/page.tsx`
- The page shows "Meet Ayaan" heading but no chat interface is visible
- Fix: Ensure the chat component mounts correctly on page load
- Add a visible chat input box and message thread on page load
- Add a welcome message from Ayaan on first load:
  > "Welcome to Asuka Couture. I'm Ayaan, your personal AI stylist. Tell me about your upcoming occasion and I'll curate the perfect look for you."

### 1.3 Fix Make It Yourself — add free text input
**File:** `app/make-it-yourself/page.tsx`
- Step 5 of the form has no free text field
- Fix: Add a textarea for "Personal Inputs" where users describe their vision in their own words
- This text should be passed to `/api/design` as the main prompt
- Add a "Generate My Design" CTA button at the end of the form

### 1.4 Add Rate Limiting to all AI API routes
**Files:** `app/api/stylist/route.ts`, `app/api/design/route.ts`, `app/api/sizer/route.ts`
- Install: `npm install @upstash/ratelimit @upstash/redis`
- Limit: 20 requests per IP per hour for stylist and design
- Limit: 50 requests per IP per hour for sizer
- Return 429 with message: "You've reached your limit. Please try again later."

### 1.5 Add Input Validation + Prompt Injection Protection
**Files:** All `/api/*` routes
- Sanitize all incoming `message` fields before passing to Groq
- Block messages containing: system prompt injection patterns like "ignore previous instructions", "you are now", "act as"
- Max message length: 500 characters
- Return 400 with message: "Invalid input" if validation fails

### 1.6 Fix "DOWNLOAD SIZE CHART FOR OFFLINE VISIT" broken link
**File:** Product page component
- Either link to an actual downloadable PDF in `/public/size-chart.pdf`
- Or remove the link entirely if no PDF exists

---

## PHASE 2 — Experience Layer
> Estimated time: 2–3 weeks | Core features that make Asuka feel premium

### 2.1 Real-Time Inventory Awareness
**Goal:** AI only recommends in-stock products in the user's size

**New file:** `lib/inventory.ts`
```typescript
// Functions needed:
// getProductStock(productId: string): Promise<{size: string, inStock: boolean, quantity: number}[]>
// getInStockProducts(category: string, size?: string): Promise<Product[]>
// isLowStock(productId: string, size: string): boolean // true if quantity <= 3
```

**Update:** `lib/groq.ts`
- Before building the AI prompt, fetch live stock data from MongoDB `asuka_products` collection
- Inject stock context into the system prompt:
  > "The following products are currently in stock in size {userSize}: [product list]. Do NOT recommend out-of-stock items."
- If a product is low stock (≤3 units), include: "Only 2 left in your size" in the recommendation

**Update:** `app/api/stylist/route.ts`
- Extract user's size from session if available (from Style Profile — see 2.2)
- Pass size to inventory check before generating response

### 2.2 Persistent Style Profile
**Goal:** Ayaan remembers each user across sessions

**New MongoDB collection:** `user_profiles`
```typescript
interface UserProfile {
  _id: string;           // session_id or user_id
  name?: string;
  preferredSize?: string;        // from AI Sizer results
  preferredFabrics?: string[];   // e.g. ["linen", "silk"]
  occasions?: string[];          // past occasions they've shopped for
  colorPreferences?: string[];
  budgetRange?: string;          // e.g. "₹50k - ₹1L"
  lastInteraction?: Date;
  conversationSummary?: string;  // AI-generated summary of past chats
}
```

**New file:** `lib/profile.ts`
```typescript
// Functions needed:
// getProfile(sessionId: string): Promise<UserProfile | null>
// updateProfile(sessionId: string, updates: Partial<UserProfile>): Promise<void>
// generateProfileSummary(messages: Message[]): Promise<string> // uses Groq to summarize
```

**Update:** `app/api/stylist/route.ts`
- On each request, load user profile and inject into system prompt:
  > "User profile: Size {size}, prefers {fabrics}, budget {budget}. Past context: {summary}"
- After each conversation, use Groq to extract and save profile updates (size mentioned, fabrics liked, budget stated)

**Update:** `components/widget/AIWidget.tsx`
- If profile exists and has a name, greet by name: "Welcome back, {name}"
- Show a subtle "Your Style Profile" section in the widget showing saved preferences

### 2.3 AI Sizer → Auto-Select Size on Product Page
**Goal:** When sizer recommends a size, it automatically highlights that size on the product page

**Update:** `components/widget/AIWidget.tsx`
- After sizer returns a recommended size, emit a custom browser event:
  ```typescript
  window.dispatchEvent(new CustomEvent('asuka:size-recommended', { detail: { size: 'L' } }))
  ```

**Update:** Product page size selector component
- Listen for `asuka:size-recommended` event
- Automatically select the recommended size and highlight it with a subtle glow/indicator
- Show tooltip: "✦ Recommended by AI Sizer"

### 2.4 Occasion Calendar + Reminders
**Goal:** Capture event date and send a reminder before the occasion

**New MongoDB collection:** `occasion_reminders`
```typescript
interface OccasionReminder {
  sessionId: string;
  occasion: string;       // "wedding", "sangeet", etc.
  eventDate: Date;
  reminderSent: boolean;
  contactMethod: string;  // "email" or "whatsapp"
  contactValue: string;   // email or phone
  designBriefId?: string; // linked MIY brief if any
}
```

**Update:** `app/make-it-yourself/page.tsx`
- After "The Occasion" step, add: "When is your event?" date picker
- Add: "Remind me before my event" toggle with email input

**New file:** `app/api/reminders/route.ts`
- GET endpoint that checks for upcoming occasions (7 days, 3 days, 1 day before)
- Sends reminder email via Nodemailer or Resend:
  > "Your {occasion} is in 7 days. Your custom {garment} design is ready. [View Design] [Book Appointment]"
- Set up a Vercel Cron Job to call this endpoint daily

**Install:** `npm install resend` (for email) or configure with existing email provider

### 2.5 Hyper-Local AI Personalities
**Goal:** AI adjusts tone and recommendations based on user's city

**Update:** `lib/groq.ts`
- Add location context to system prompts based on detected or selected city
- Hyderabad: emphasize Asuka's flagship store, local craftsmanship, Nawabi heritage
- Mumbai: emphasize contemporary luxury, Bollywood celebrity styles
- Ahmedabad: emphasize traditional craftsmanship, patola-inspired textiles, C.G. Road exclusives

**Update:** `components/widget/AIWidget.tsx`
- On first open, detect city via browser geolocation API (with permission) OR
- Show a subtle "Your city:" selector (Hyderabad / Mumbai / Ahmedabad / Other)
- Store city in localStorage and pass to all API calls as `location` parameter

**Update:** All `/api/*` routes
- Accept optional `location` parameter
- Pass to Groq prompt builder in `lib/groq.ts`

### 2.6 Graph-Based Styling ("Complete the Look")
**Goal:** When AI recommends a garment, it also suggests matching accessories

**New MongoDB collection:** `styling_graph`
```typescript
interface StylingPair {
  productId: string;
  productType: string;    // "sherwani", "kurta", etc.
  pairsWellWith: {
    productId: string;
    productType: string;  // "embroidered-shoes", "stole", etc.
    reason: string;       // "complementary embroidery pattern"
  }[]
}
```

**New file:** `lib/styling-graph.ts`
```typescript
// Functions needed:
// getCompleteLook(productId: string): Promise<Product[]>
// getStylingPairs(productType: string, occasion: string): Promise<Product[]>
```

**Update:** `app/api/stylist/route.ts`
- After recommending a main garment, call `getCompleteLook()` and append to response:
  > "To complete this look, I'd suggest pairing it with {shoe} and {stole} from our collection."
- Include product links and images in the response

**Update:** `components/widget/AIWidget.tsx`
- Render "Complete the Look" product cards below the AI text response
- Show product image, name, price, and "Add to Cart" button

---

## PHASE 3 — Premium AI Features
> Estimated time: 4–5 weeks | Features no other Indian brand has

### 3.1 Multilingual Support (Hindi + Telugu)
**Goal:** Users can chat with Ayaan in Hindi or Telugu

**Update:** `lib/groq.ts`
- Detect input language using a lightweight check (or ask Groq to detect it)
- If Hindi detected, respond in Hindi with Devanagari script
- If Telugu detected, respond in Telugu
- Add language-specific system prompt variations

**Update:** `components/widget/AIWidget.tsx`
- Add language selector: 🇬🇧 EN | हिं HI | తె TE
- Store preference in localStorage and send as `language` param to all APIs
- Placeholder text in chat input changes based on selected language

### 3.2 Voice Input
**Goal:** Users can speak to Ayaan instead of typing

**Update:** `components/widget/AIWidget.tsx`
- Add microphone button next to the text input
- Use Web Speech API (`window.SpeechRecognition`) for browser-native voice recognition
- On speech end, auto-populate the text input and submit
- Show visual waveform animation while listening
- Fallback gracefully if browser doesn't support it

```typescript
// Voice input implementation outline:
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN'
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  setMessage(transcript)
}
```

### 3.3 AI Lookbook Generator
**Goal:** Generate a downloadable PDF lookbook from a design brief

**New file:** `app/api/lookbook/route.ts`
- Input: `designBriefId` from MongoDB `design_briefs` collection
- Steps:
  1. Fetch design brief from MongoDB
  2. Use Groq to generate lookbook content (outfit description, occasion context, styling notes, care instructions, 3 ways to style the piece)
  3. Generate PDF using `@react-pdf/renderer`
  4. Return PDF as downloadable file

**Install:** `npm install @react-pdf/renderer`

**New file:** `components/LookbookPDF.tsx`
- React PDF component with Asuka branding
- Sections: Cover page, The Design, The Occasion, Styling Notes, Care Instructions, About Asuka
- Premium layout matching Asuka's luxury aesthetic (dark background, gold accents)

**Update:** `app/make-it-yourself/page.tsx`
- After AI generates a design brief, show: "✦ Download Your Lookbook" button
- Call `/api/lookbook` and trigger PDF download

### 3.4 WhatsApp Integration
**Goal:** Users can chat with Ayaan on WhatsApp

**Service:** WhatsApp Business API via Twilio or 360dialog

**New file:** `app/api/whatsapp/route.ts`
- Webhook endpoint that receives WhatsApp messages
- Routes messages to same Groq AI logic as web chat (`lib/groq.ts`)
- Sends response back via WhatsApp API
- Loads/saves user profile same as web chat

**New file:** `lib/whatsapp.ts`
```typescript
// Functions needed:
// sendWhatsAppMessage(to: string, message: string): Promise<void>
// parseIncomingWebhook(body: any): { from: string, message: string, sessionId: string }
// formatProductsForWhatsApp(products: Product[]): string // plain text format
```

**Setup required:**
- Register WhatsApp Business number
- Set webhook URL to: `https://asuka-neon.vercel.app/api/whatsapp`
- Add env vars: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`

**Update:** Homepage and product pages
- Add "Chat on WhatsApp" button that opens WhatsApp with pre-filled message:
  > "Hi Ayaan! I need help finding the perfect outfit."

### 3.5 Visual RAG (Image-Based Product Search)
**Goal:** User uploads a photo and Ayaan finds the closest matching product

**Install:** `npm install @pinecone-database/pinecone` or use MongoDB Atlas Vector Search

**New file:** `lib/embeddings.ts`
```typescript
// Functions needed:
// generateImageEmbedding(imageUrl: string): Promise<number[]>  // use CLIP model via Replicate API
// searchSimilarProducts(embedding: number[], limit: number): Promise<Product[]>
// indexProduct(product: Product): Promise<void>  // run once to index all products
```

**New file:** `app/api/visual-search/route.ts`
- Accept: base64 image or image URL
- Generate embedding using CLIP model (via Replicate API)
- Search MongoDB Atlas Vector Search for similar products
- Return top 5 matching products with similarity scores

**Update:** `components/widget/AIWidget.tsx`
- Add image upload button (📷) in the chat input area
- Show preview of uploaded image
- Display results as product cards: "I found these pieces that match your inspiration:"

**Required services:**
- Replicate API for CLIP embeddings: `REPLICATE_API_TOKEN` env var
- Enable MongoDB Atlas Vector Search on `asuka_products` collection
- Run indexing script once: `npm run index-products`

### 3.6 Staff Dashboard
**Goal:** Internal tool for Asuka store staff to see customer AI activity

**New file:** `app/dashboard/page.tsx`
- Password protected (simple env var password for now)
- Sections:
  1. **Today's Activity** — number of AI sessions, sizer uses, design briefs
  2. **Design Briefs** — list of all MIY designs with customer details and event dates
  3. **Upcoming Occasions** — customers with events in next 30 days
  4. **Popular Searches** — most asked about products/styles/occasions
  5. **Size Trends** — most common size conversions searched

**New file:** `app/api/dashboard/route.ts`
- Protected with `DASHBOARD_SECRET` env var (check Authorization header)
- Aggregates data from all MongoDB collections
- Returns dashboard JSON

**Update:** `app/api/analytics/route.ts`
- Ensure all AI interactions are logging to `analytics_events` with proper event types:
  - `sizer_used`, `style_session_started`, `design_brief_created`, `product_recommended`, `lookbook_downloaded`

---

## Environment Variables to Add

```env
# Existing
MONGODB_URI=
GROQ_API_KEY=

# Phase 1
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Phase 2
RESEND_API_KEY=              # for occasion reminder emails

# Phase 3
REPLICATE_API_TOKEN=         # for visual search embeddings
WHATSAPP_TOKEN=              # WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=    # WhatsApp Business number
DASHBOARD_SECRET=            # staff dashboard password
```

---

## MongoDB Collections Summary

| Collection | Purpose | Phase |
|---|---|---|
| `sizer_logs` | Sizer usage logs | Existing |
| `style_sessions` | Chat sessions | Existing |
| `style_messages` | Chat messages | Existing |
| `asuka_products` | Product catalogue | Existing |
| `design_briefs` | MIY design outputs | Existing |
| `analytics_events` | All event tracking | Existing |
| `user_profiles` | Persistent style profiles | Phase 2 |
| `occasion_reminders` | Event reminders | Phase 2 |
| `styling_graph` | Product pairing data | Phase 2 |

---

## Build Order (Recommended)

```
Phase 1 (do first — fix what's broken):
  □ 1.1 Fix badge bug
  □ 1.2 Fix AI Stylist page
  □ 1.3 Fix MIY free text input
  □ 1.4 Add rate limiting
  □ 1.5 Add input validation
  □ 1.6 Fix broken size chart link

Phase 2 (experience layer):
  □ 2.1 Real-time inventory awareness
  □ 2.2 Persistent style profile
  □ 2.3 AI Sizer → auto-select size
  □ 2.4 Occasion calendar + reminders
  □ 2.5 Hyper-local AI personalities
  □ 2.6 Graph-based styling

Phase 3 (premium AI):
  □ 3.1 Multilingual (Hindi + Telugu)
  □ 3.2 Voice input
  □ 3.3 AI Lookbook Generator
  □ 3.4 WhatsApp Integration
  □ 3.5 Visual RAG
  □ 3.6 Staff Dashboard
```

---

## Testing Checklist (after each feature)

- [ ] Feature works on desktop Chrome
- [ ] Feature works on mobile (test on actual phone)
- [ ] AI responses are in correct language
- [ ] MongoDB data is being saved correctly
- [ ] Rate limiting triggers after threshold
- [ ] No console errors in production
- [ ] Vercel deployment succeeds

---

*Built for Asuka Couture by diyaa.ai*