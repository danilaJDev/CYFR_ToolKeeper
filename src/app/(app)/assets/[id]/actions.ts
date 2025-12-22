"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function s(fd: FormData, k: string) {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
}

export async function performTransferAction(formData: FormData) {
    const assetId = s(formData, "asset_id");
    const action = s(formData, "action");
    const toLocationId = s(formData, "to_location_id");
    const note = s(formData, "note");

    if (!assetId || !action || !toLocationId) {
        redirect(`/assets/${assetId}?error=` + encodeURIComponent("Заполни все поля"));
    }

    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {error} = await supabase.rpc("perform_transfer", {
        p_asset_id: assetId,
        p_action: action,
        p_to_location_id: toLocationId,
        p_note: note || null,
    });

    if (error) {
        redirect(`/assets/${assetId}?error=` + encodeURIComponent(error.message));
    }

    revalidatePath(`/assets/${assetId}`);
    revalidatePath("/assets");
    redirect(`/assets/${assetId}`);
}