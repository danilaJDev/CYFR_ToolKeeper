import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
