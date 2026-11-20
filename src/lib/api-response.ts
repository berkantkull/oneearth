export function apiError(message: string, status: number, details?: unknown) {
  return Response.json({ error: message, details }, { status });
}

export const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };
