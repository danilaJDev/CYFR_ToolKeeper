import {type CookieOptionsWithName, createServerClient} from "@supabase/ssr";
import {type NextRequest, NextResponse} from "next/server";
import {env} from "@/lib/env";

type CookieToSet = {
    name: string;
    value: string;
    options?: CookieOptionsWithName;
};

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
    request.cookies.getAll().forEach(({name}) => {
        if (name.startsWith("sb-")) {
            request.cookies.delete(name);
            response.cookies.delete(name);
        }
    });
}

export async function updateSession(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

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
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {error} = await supabase.auth.getUser();

    if (
        error?.code === "refresh_token_not_found" ||
        error?.code === "invalid_refresh_token"
    ) {
        clearSupabaseAuthCookies(request, response);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
}