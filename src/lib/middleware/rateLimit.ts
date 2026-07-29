import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (
  req: NextRequest,
  context?: unknown
) => Promise<NextResponse>;

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}

// In-memory store for rate limiting (per server instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up stale entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60_000);

export function withRateLimit(
  handler: RouteHandler,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 100 }
): RouteHandler {
  const { windowMs, maxRequests, keyGenerator } = config;

  return async (req, context) => {
    // Generate a unique key for this request
    const key = keyGenerator
      ? keyGenerator(req)
      : req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    const now = Date.now();
    const record = rateLimitStore.get(key);

    // If no record or window has expired, create new record
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return handler(req, context);
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Add rate limit headers
    const response = await handler(req, context);
    response.headers.set("X-RateLimit-Limit", maxRequests.toString());
    response.headers.set("X-RateLimit-Remaining", (maxRequests - record.count).toString());

    return response;
  };
}
