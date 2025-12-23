"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerActionSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { getString } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  const supabase = await createServerActionSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    fullName: getString(formData, "fullName"),
  });

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent("Invalid form")}`);
  }

  const supabase = await createServerActionSupabaseClient();
  const serviceSupabase = createServiceSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    redirect(`/register?error=${encodeURIComponent(error?.message ?? "Unable to sign up")}`);
  }

  const { error: profileError } = await serviceSupabase.from("profiles").upsert({
    id: data.user.id,
    full_name: parsed.data.fullName,
  });

  if (profileError) {
    redirect(`/register?error=${encodeURIComponent("profile")}`);
  }

  const { data: org } = await serviceSupabase
    .from("organizations")
    .insert({ name: `${parsed.data.fullName}'s Org`, created_by: data.user.id })
    .select("id")
    .single();

  if (org?.id) {
    const { error: memberError } = await serviceSupabase
      .from("organization_members")
      .insert({ organization_id: org.id, user_id: data.user.id, role: "owner" });

    if (memberError) {
      redirect(`/register?error=${encodeURIComponent("membership")}`);
    }

    await serviceSupabase
      .from("profiles")
      .update({
        default_organization_id: org.id,
        organization_id: org.id,
        org_id: org.id,
        role: "owner",
      })
      .eq("id", data.user.id);
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createServerActionSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/login");
}
