import {cookies} from "next/headers";
import {createServerClient} from "@supabase/ssr";
import type {SupabaseClient} from "@supabase/supabase-js";
import {env} from "@/lib/env";
import type {Database} from "@/lib/types";

async function createSupabaseServerClient(): Promise<SupabaseClient<Database>> {
    // ✅ Next.js 16: cookies() возвращает Promise
    const cookieStore = await cookies();

    return createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    for (const {name, value, options} of cookiesToSet) {
                        cookieStore.set({name, value, ...options});
                    }
                } catch {
                    // Server Components / read-only context: set недоступен — игнорируем
                }
            },
        },
    });
}

export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
    return createSupabaseServerClient();
}

export async function createServerActionSupabaseClient(): Promise<SupabaseClient<Database>> {
    return createSupabaseServerClient();
}
