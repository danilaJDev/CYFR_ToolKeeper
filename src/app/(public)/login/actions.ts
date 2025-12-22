"use server";

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

function getString(fd: FormData, key: string): string {
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

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Не раскрывай детали ошибок в production
        const errorMessage =
            error.message === "Invalid login credentials"
                ? "Email или пароль неверны"
                : error.message;

        redirect("/login?error=" + encodeURIComponent(errorMessage));
    }

    // Успешный вход — перенаправляем на dashboard
    redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
    const email = getString(formData, "email");
    const password = getString(formData, "password");

    if (!email || !password) {
        redirect("/login?error=" + encodeURIComponent("Введите email и пароль"));
    }

    // Проверка пароля (минимум 6 символов для безопасности)
    if (password.length < 6) {
        redirect(
            "/login?error=" +
            encodeURIComponent("Пароль должен быть минимум 6 символов")
        );
    }

    const supabase = await createClient();

    const {error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    // Успешная регистрация
    redirect(
        "/login?success=" +
        encodeURIComponent(
            "Аккаунт создан! Проверь почту для подтверждения (если включено)."
        )
    );
}

export async function signOutAction() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/login");
}