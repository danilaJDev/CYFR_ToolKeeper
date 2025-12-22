"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function get(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export async function createTransferAction(_: unknown, formData: FormData) {
    const assetName = get(formData, "asset_name");
    const from = get(formData, "from_location");
    const to = get(formData, "to_location");
    const status = get(formData, "status") || "В пути";
    const eta = get(formData, "eta");
    const note = get(formData, "note");

    if (!assetName || !to) {
        return {error: "Укажите инструмент и конечную точку"};
    }

    const supabase = await createClient();
    const {error} = await supabase.from("transfers").insert({
        asset_name: assetName,
        from_location: from || null,
        to_location: to,
        status,
        eta: eta || null,
        note: note || null,
    });

    if (error) {
        return {error: error.message};
    }

    revalidatePath("/transfers");
    revalidatePath("/dashboard");

    return {success: true};
}
