"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function pick(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export async function createLocationAction(_: unknown, formData: FormData) {
    const name = pick(formData, "name");
    const type = pick(formData, "type");
    if (!name) {
        return {error: "Добавьте название локации"};
    }

    const supabase = await createClient();
    const {error} = await supabase.from("locations").insert({
        name,
        type: type || null,
    });

    if (error) {
        return {error: error.message};
    }

    revalidatePath("/locations");
    revalidatePath("/dashboard");
    revalidatePath("/assets");

    return {success: true};
}
