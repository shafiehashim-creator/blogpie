import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien tanpa kuki untuk bacaan awam (boleh di-cache / ISR).
 * Pulang null jika env Supabase belum ditetapkan, supaya laman tetap boleh dibina.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
