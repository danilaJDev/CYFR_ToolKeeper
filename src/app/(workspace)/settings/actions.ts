"use server";

import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

function get(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export async function updateSettingsAction(_: unknown, formData: FormData) {
    const company = get(formData, "company");
    const warehouse = get(formData, "warehouse");
    const notifyReceipts = formData.get("notify_receipts") === "on";
    const notifyService = formData.get("notify_service") === "on";

    const supabase = await createClient();
    const {data: userResponse} = await supabase.auth.getUser();

    if (!userResponse.user) {
        return {error: "Не удалось определить пользователя"};
    }

    const {error} = await supabase.from("settings").upsert({
        id: userResponse.user.id,
        company_name: company || null,
        warehouse_name: warehouse || null,
        notify_receipts: notifyReceipts,
        notify_service: notifyService,
    });

    if (error) {
        return {error: error.message};
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return {success: true};
}
