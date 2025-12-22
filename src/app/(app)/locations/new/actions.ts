"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function s(fd: FormData, k: string) {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
}

export async function createLocationAction(formData: FormData) {
    const name = s(formData, "name");
    const type = s(formData, "type");
    const address = s(formData, "address");
    const notes = s(formData, "notes");

    if (!name) redirect("/locations/new?error=" + encodeURIComponent("Name is required"));
    if (!type) redirect("/locations/new?error=" + encodeURIComponent("Type is required"));

    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {data: profile} = await supabase.from("profiles").select("org_id").single();
    if (!profile?.org_id) redirect("/locations/new?error=" + encodeURIComponent("Profile/org not found"));

    const {error} = await supabase.from("locations").insert({
        org_id: profile.org_id,
        name,
        type,
        address: address || null,
        notes: notes || null,
    });

    if (error) redirect("/locations/new?error=" + encodeURIComponent(error.message));

    revalidatePath("/locations");
    redirect("/locations");
}