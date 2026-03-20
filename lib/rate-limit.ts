// Simple In-Memory Rate Limiter Map
// Note: In serverless environments (like Netlify/Vercel functions), this state may be reset frequently.
// However, it still provides a basic defense against rapid abuse within a single function instance's lifecycle.

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

// Map IP -> Tracker
const ipTracker = new Map<string, RateLimitTracker>();

// Default configuration
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per IP

/**
 * Checks if a given IP has exceeded its rate limit.
 * @param ip Client IP address
 * @returns { success: boolean, remaining: number, reset: number }
 */
export function checkRateLimit(ip: string | null): { success: boolean, remaining: number, reset: string } {
  const clientIp = ip || 'anonymous_ip';
  const now = Date.now();

  const tracker = ipTracker.get(clientIp);

  if (!tracker) {
    // First request
    ipTracker.set(clientIp, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
    
    return {
      success: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      reset: new Date(now + WINDOW_MS).toISOString()
    };
  }

  if (now > tracker.resetTime) {
    // Window expired, reset counter
    tracker.count = 1;
    tracker.resetTime = now + WINDOW_MS;
    ipTracker.set(clientIp, tracker);
    
    return {
      success: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      reset: new Date(tracker.resetTime).toISOString()
    };
  }

  // Still within window
  tracker.count += 1;
  ipTracker.set(clientIp, tracker);

  if (tracker.count > MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: new Date(tracker.resetTime).toISOString()
    };
  }

  return {
    success: true,
    remaining: MAX_REQUESTS_PER_WINDOW - tracker.count,
    reset: new Date(tracker.resetTime).toISOString()
  };
}

// Clean up stale entries every 5 minutes to prevent memory leaks in long-running processes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, tracker] of ipTracker.entries()) {
      if (now > tracker.resetTime) {
        ipTracker.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}
