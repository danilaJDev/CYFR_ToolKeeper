import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";
import { locales, defaultLocale } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "always"
});

export function proxy(request: NextRequest) {
    return updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};