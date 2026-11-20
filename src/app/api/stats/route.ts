import { apiError, noStoreHeaders } from "@/lib/api-response";
import { countLights } from "@/lib/server/lights";

export async function GET() {
  try {
    return Response.json(await countLights(), { headers: noStoreHeaders });
  } catch (error) {
    console.error("Failed to count lights", error);
    return apiError("The light count is temporarily unavailable.", 503);
  }
}
