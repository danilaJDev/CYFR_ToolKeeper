import {type CookieOptionsWithName, createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {env} from "@/lib/env";

type CookieToSet = {
    name: string;
    value: string;
    options?: CookieOptionsWithName;
};

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll().map(({name, value}) => ({name, value}));
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                    }
                },
            },
        }
    );
}