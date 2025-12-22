import {NextResponse, type NextRequest} from "next/server";
import {updateSession} from "@/lib/supabase/session";

export async function middleware(request: NextRequest) {
    return await updateSession(request, NextResponse.next());
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
