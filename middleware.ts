import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {updateSession} from "@/lib/supabase/session";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({request: {headers: request.headers}});
    return updateSession(request, response);
}

export const config = {
    matcher: [
        "/:path((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    ],
};