import { z } from "zod";
import { apiError, noStoreHeaders } from "@/lib/api-response";
import { getLight } from "@/lib/server/lights";

const idSchema = z.uuid();

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!idSchema.safeParse(id).success) return apiError("Light not found.", 404);

  try {
    const light = await getLight(id);
    if (!light) return apiError("Light not found.", 404);
    return Response.json({ light }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("Failed to load light", error);
    return apiError("This light is temporarily unavailable.", 503);
  }
}
