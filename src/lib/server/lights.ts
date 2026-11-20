import { demoLights } from "@/data/demo-lights";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/server/supabase";
import type { CreateLightInput, Light, LightsPage } from "@/types/light";

type DbLight = {
  id: string;
  word: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

const toLight = (row: DbLight): Light => ({ ...row, createdAt: row.created_at });

function encodeCursor(row: DbLight) {
  return Buffer.from(JSON.stringify({ createdAt: row.created_at, id: row.id })).toString("base64url");
}

function decodeCursor(cursor: string) {
  try {
    const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as { createdAt?: string; id?: string };
    if (!value.createdAt || !value.id || Number.isNaN(Date.parse(value.createdAt))) return null;
    return value as { createdAt: string; id: string };
  } catch {
    return null;
  }
}

export async function listLights(limit: number, cursor?: string): Promise<LightsPage> {
  if (!hasSupabaseConfig()) {
    return { lights: demoLights.slice(0, limit), nextCursor: null, demo: true };
  }

  const admin = getSupabaseAdmin();
  let query = admin
    .from("lights")
    .select("id,word,latitude,longitude,created_at")
    .eq("status", "visible")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    const parsed = decodeCursor(cursor);
    if (!parsed) throw new Error("INVALID_CURSOR");
    query = query.lt("created_at", parsed.createdAt);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as DbLight[];
  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);
  return {
    lights: page.map(toLight),
    nextCursor: hasMore && page.length ? encodeCursor(page[page.length - 1]) : null,
    demo: false,
  };
}

export async function getLight(id: string): Promise<Light | null> {
  if (!hasSupabaseConfig()) return demoLights.find((light) => light.id === id) ?? null;

  const { data, error } = await getSupabaseAdmin()
    .from("lights")
    .select("id,word,latitude,longitude,created_at")
    .eq("id", id)
    .eq("status", "visible")
    .maybeSingle();
  if (error) throw error;
  return data ? toLight(data as DbLight) : null;
}

export async function createLight(input: CreateLightInput): Promise<{ light: Light; demo: boolean }> {
  if (!hasSupabaseConfig()) {
    return {
      light: { id: crypto.randomUUID(), ...input, createdAt: new Date().toISOString() },
      demo: true,
    };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("lights")
    .insert({ ...input, status: "visible" })
    .select("id,word,latitude,longitude,created_at")
    .single();
  if (error) throw error;
  return { light: toLight(data as DbLight), demo: false };
}

export async function countLights() {
  if (!hasSupabaseConfig()) return { count: demoLights.length, demo: true };
  const { count, error } = await getSupabaseAdmin()
    .from("lights")
    .select("id", { count: "exact", head: true })
    .eq("status", "visible");
  if (error) throw error;
  return { count: count ?? 0, demo: false };
}
