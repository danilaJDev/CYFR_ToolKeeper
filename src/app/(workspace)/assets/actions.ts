"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function get(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export async function createAssetAction(_: unknown, formData: FormData) {
    const name = get(formData, "name");
    const status = get(formData, "status") || "В работе";
    const location = get(formData, "location");
    const owner = get(formData, "owner");
    const serial = get(formData, "serial_number");
    const note = get(formData, "note");

    if (!name) {
        return {error: "Добавьте название инструмента"};
    }

    const supabase = await createClient();
    const {error} = await supabase.from("assets").insert({
        name,
        status,
        location_name: location || null,
        owner: owner || null,
        serial_number: serial || null,
        note: note || null,
    });

    if (error) {
        return {error: error.message};
    }

    revalidatePath("/assets");
    revalidatePath("/dashboard");
    revalidatePath("/locations");

    return {success: true};
}
