import {type CookieOptionsWithName, createServerClient} from "@supabase/ssr";
import {type NextRequest, NextResponse} from "next/server";
import {env} from "@/lib/env";

type CookieToSet = {
    name: string;
    value: string;
    options?: CookieOptionsWithName;
};

export async function updateSession(request: NextRequest, response: NextResponse) {
    const supabaseResponse = response;

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll().map(({name, value}) => ({name, value}));
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    cookiesToSet.forEach(({name, value, options}) => {
                        request.cookies.set(name, value);
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    await supabase.auth.getUser();

    return supabaseResponse;
}