"use server";

import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {createClient} from "@/lib/supabase/server";

function getString(fd: FormData, key: string) {
    const v = fd.get(key);
    return typeof v === "string" ? v.trim() : "";
}

export async function signInAction(formData: FormData) {
    const email = getString(formData, "email");
    const password = getString(formData, "password");

    if (!email || !password) {
        redirect("/login?error=" + encodeURIComponent("Введите email и пароль"));
    }

    const supabase = await createClient();
    const {error} = await supabase.auth.signInWithPassword({email, password});

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    redirect("/dashboard");
}

const fallbackOrigins = [
    () => headers().get("origin"),
    () => process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    () => process.env.URL ?? null,
    () => "http://localhost:3000",
];

function resolveSiteOrigin(): string {
    for (const getOrigin of fallbackOrigins) {
        const origin = getOrigin();
        if (origin) return origin;
    }
    return "http://localhost:3000";
}

export async function signUpAction(formData: FormData) {
    const email = getString(formData, "email");
    const password = getString(formData, "password");

    if (!email || !password) {
        redirect("/login?error=" + encodeURIComponent("Введите email и пароль"));
    }

    const supabase = await createClient();
    const origin = resolveSiteOrigin();

    // Если origin не определён, Supabase вернёт "Database error saving new user" —
    // поэтому подставляем гарантированный URL из запроса или окружения.
    const {error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        const message = error.message === "Database error saving new user"
            ? "Supabase отклонил создание аккаунта. Проверь, что адрес приложения есть в Site URL/Redirect URLs проекта Supabase."
            : error.message;

        redirect("/login?error=" + encodeURIComponent(message));
    }

    redirect(
        "/login?success=" +
        encodeURIComponent("Аккаунт создан. Подтверди email по ссылке в письме, затем войди."),
    );
}
