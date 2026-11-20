"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CreateLightInput, Light } from "@/types/light";

type DbLight = {
  id: string;
  word: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
let client: SupabaseClient | null = null;

const toLight = (row: DbLight): Light => ({ ...row, createdAt: row.created_at });

export function hasPublicLightsBackend() {
  return Boolean(url && publishableKey);
}

function getClient() {
  if (!url || !publishableKey) throw new Error("PUBLIC_BACKEND_NOT_CONFIGURED");
  client ??= createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

export async function listPublicLights(limit = 200) {
  const { data, error, count } = await getClient()
    .from("lights")
    .select("id,word,latitude,longitude,created_at", { count: "exact" })
    .eq("status", "visible")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { lights: ((data ?? []) as DbLight[]).map(toLight), count: count ?? 0 };
}

export async function getPublicLight(id: string) {
  const { data, error } = await getClient()
    .from("lights")
    .select("id,word,latitude,longitude,created_at")
    .eq("id", id)
    .eq("status", "visible")
    .maybeSingle();
  if (error) throw error;
  return data ? toLight(data as DbLight) : null;
}

export async function createPublicLight(input: CreateLightInput, clientId: string) {
  const { data, error } = await getClient()
    .rpc("create_public_light", {
      p_word: input.word,
      p_latitude: input.latitude,
      p_longitude: input.longitude,
      p_client_id: clientId,
    })
    .single();
  if (error) throw error;
  return toLight(data as DbLight);
}

export function getPublicClientId() {
  const storageKey = "one-earth-public-client";
  const stored = window.localStorage.getItem(storageKey);
  if (stored) return stored;
  const id = crypto.randomUUID();
  window.localStorage.setItem(storageKey, id);
  return id;
}
