// Simple in-memory rate limiter for token refresh
//
// IMPORTANT: This implementation uses in-memory storage which does NOT work
// in serverless/serverless-like environments (Vercel, AWS Lambda, etc.) because
// each request may run in a fresh container/process, making the Map empty.
//
// For production, use @upstash/ratelimit with Redis for distributed rate limiting.
// This implementation is suitable for local development or single-server deployments.

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000, // 1 minute
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

export function clearRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
