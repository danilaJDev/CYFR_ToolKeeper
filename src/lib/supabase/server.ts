import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  // Read-only client for Server Components/Route Handlers where cookie mutation is disallowed.
  return createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}

export async function createServerActionSupabaseClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  // Writable client for Server Actions where cookie updates are permitted.
  return createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
