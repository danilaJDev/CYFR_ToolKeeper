import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

function createSupabaseServerClient(): SupabaseClient<Database> {
  const cookieStore = cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Setting cookies is not available in read-only contexts (e.g. Server Components).
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Removing cookies is not available in read-only contexts (e.g. Server Components).
        }
      },
    },
  });
}

export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  return createSupabaseServerClient();
}

export async function createServerActionSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  return createSupabaseServerClient();
}
