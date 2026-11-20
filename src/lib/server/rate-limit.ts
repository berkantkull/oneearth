import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = { success: boolean; configured: boolean };

const developmentHits = new Map<string, number[]>();

async function hashIdentifier(value: string) {
  const bytes = new TextEncoder().encode(`${process.env.RATE_LIMIT_SALT ?? "one-earth-dev"}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function checkSubmissionRateLimit(request: Request): Promise<LimitResult> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = await hashIdentifier(forwarded || request.headers.get("user-agent") || "anonymous");

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(4, "10 m"),
      prefix: "one-earth:submit",
      analytics: false,
    });
    const result = await limiter.limit(identifier);
    return { success: result.success, configured: true };
  }

  if (process.env.NODE_ENV === "production") return { success: false, configured: false };

  // Development-only, process-local fallback. Production fails closed without Upstash.
  const now = Date.now();
  const recent = (developmentHits.get(identifier) ?? []).filter((time) => now - time < 600_000);
  if (recent.length >= 4) return { success: false, configured: false };
  developmentHits.set(identifier, [...recent, now]);
  return { success: true, configured: false };
}
