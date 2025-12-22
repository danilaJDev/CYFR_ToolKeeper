import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        const errorMessage = "Не найден код подтверждения. Попробуйте ещё раз.";
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url));
    }

    const supabase = await createClient();
    const {error} = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent("Не удалось подтвердить почту: " + error.message)}`, request.url),
        );
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
}
