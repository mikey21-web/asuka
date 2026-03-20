/* ═══════════════════════════════════════════════════════════
   ASUKA COUTURE — GLOBAL TYPE DEFINITIONS
   Used to satisfy IDE and build environment when node_modules
   are not locally available or indexed.
   ═══════════════════════════════════════════════════════════ */

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    GROQ_API_KEY: string;
    N8N_LEADS_URL: string;
    SHOP_DOMAIN?: string;
    SHOP_ACCESS_TOKEN?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
  }
}

declare module 'next/server' {
  export class NextRequest extends Request {
    [key: string]: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    [key: string]: any;
  }
}
