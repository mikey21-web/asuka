/* ═══════════════════════════════════════════════════════════
   ASUKA COUTURE — GLOBAL TYPE DEFINITIONS
   Used to satisfy IDE and compiler constraints across different environments.
   ═══════════════════════════════════════════════════════════ */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MONGODB_URI: string;
    readonly SHOPIFY_STORE_URL: string;
    readonly SHOPIFY_ADMIN_TOKEN: string;
    readonly GROQ_API_KEY: string;
    readonly N8N_SIZER_URL: string;
    readonly N8N_LEADS_URL: string;
    readonly BYTEZ_API_KEY: string;
  }
}

declare var process: NodeJS.Process;

declare module 'next/server' {
  export { NextRequest, NextResponse } from 'next/server';
}

declare module 'groq-sdk' {
  export class Groq {
    constructor(config: { apiKey: string | undefined });
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
  }
}

declare module 'mongodb' {
  export class MongoClient {
    constructor(uri: string, options?: any);
    connect(): Promise<MongoClient>;
    db(name?: string): any;
  }
}

declare module 'mongoose' {
  const mongoose: any;
  export default mongoose;
}
