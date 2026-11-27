import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfigStatus {
  hasUrl: boolean;
  hasServiceRoleKey: boolean;
  hasAnonKey: boolean;
  isConfigured: boolean;
  url: string | null;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null;

  return {
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    hasAnonKey: Boolean(anonKey),
    isConfigured: Boolean(url && serviceRoleKey),
    url,
  };
}

/**
 * Server-only Supabase client using the Service Role key.
 * Never import this module into Client Components.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
