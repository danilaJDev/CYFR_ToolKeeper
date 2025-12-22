"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function getString(fd: FormData, key: string) {
    const v = fd.get(key);
    return typeof v === "string" ? v.trim() : "";
}

export async function createAssetAction(formData: FormData) {
    const name = getString(formData, "name");
    const asset_tag = getString(formData, "asset_tag");
    const category = getString(formData, "category");
    const notes = getString(formData, "notes");

    if (!name) redirect("/assets/new?error=" + encodeURIComponent("Name is required"));

    const supabase = await createClient();

    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {data: profile} = await supabase.from("profiles").select("org_id").single();
    if (!profile?.org_id) redirect("/assets/new?error=" + encodeURIComponent("Profile/org not found"));

    const {error} = await supabase.from("assets").insert({
        org_id: profile.org_id,
        name,
        asset_tag: asset_tag || null,
        category: category || null,
        notes: notes || null,
        status: "in_stock",
    });

    if (error) redirect("/assets/new?error=" + encodeURIComponent(error.message));

    revalidatePath("/assets");
    redirect("/assets");
}