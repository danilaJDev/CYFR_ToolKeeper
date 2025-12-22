import {NextResponse, type NextRequest} from "next/server";
import createMiddleware from "next-intl/middleware";
import {defaultLocale, locales} from "./i18n/routing";
import {updateSession} from "@/lib/supabase/session";

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "always",
});

export async function middleware(request: NextRequest) {
    const response = intlMiddleware(request);
    const baseResponse = response instanceof NextResponse ? response : NextResponse.next({request});

    return updateSession(request, baseResponse);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
