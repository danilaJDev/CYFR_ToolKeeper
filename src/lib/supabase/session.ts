import {type CookieOptionsWithName, createServerClient} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";
import {env} from "@/lib/env";

type CookieToSet = {
    name: string;
    value: string;
    options?: CookieOptionsWithName;
};

export async function updateSession(request: NextRequest, response: NextResponse = NextResponse.next()) {
    const supabaseResponse = response;

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll().map(({name, value}) => ({name, value}));
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    cookiesToSet.forEach(({name, value, options}) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    await supabase.auth.getUser();

    return supabaseResponse;
}