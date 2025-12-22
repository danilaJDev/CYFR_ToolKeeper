"use server";

import {redirect} from "next/navigation";
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

export async function signUpAction(formData: FormData) {
    const email = getString(formData, "email");
    const password = getString(formData, "password");

    if (!email || !password) {
        redirect("/login?error=" + encodeURIComponent("Введите email и пароль"));
    }

    const supabase = await createClient();
    const {error} = await supabase.auth.signUp({email, password});

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    redirect("/login?success=" + encodeURIComponent("Аккаунт создан. Проверь почту для подтверждения (если включено)."));
}