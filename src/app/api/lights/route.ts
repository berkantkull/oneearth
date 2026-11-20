import { apiError, noStoreHeaders } from "@/lib/api-response";
import { createLight, listLights } from "@/lib/server/lights";
import { checkSubmissionRateLimit } from "@/lib/server/rate-limit";
import { lightInputSchema, lightsQuerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = lightsQuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
  });
  if (!parsed.success) return apiError("Invalid pagination parameters.", 400, parsed.error.flatten());

  try {
    const page = await listLights(parsed.data.limit, parsed.data.cursor);
    return Response.json(page, { headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CURSOR") return apiError("Invalid cursor.", 400);
    console.error("Failed to list lights", error);
    return apiError("Lights are temporarily unavailable.", 503);
  }
}

export async function POST(request: Request) {
  const declaredSize = Number(request.headers.get("content-length") ?? "0");
  if (declaredSize > 2_048) return apiError("Payload is too large.", 413);

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 2_048) return apiError("Payload is too large.", 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return apiError("Expected a JSON request body.", 400);
  }

  const parsed = lightInputSchema.safeParse(body);
  if (!parsed.success) return apiError("Please check your word and location.", 400, parsed.error.flatten());

  try {
    const limit = await checkSubmissionRateLimit(request);
    if (!limit.success) {
      return apiError(
        limit.configured ? "Too many lights. Please try again later." : "Submissions need production rate limiting before they can open.",
        limit.configured ? 429 : 503,
      );
    }

    const result = await createLight(parsed.data);
    return Response.json(result, { status: 201, headers: noStoreHeaders });
  } catch (error) {
    console.error("Failed to create light", error);
    return apiError("Your light could not be placed. Please try again.", 503);
  }
}
