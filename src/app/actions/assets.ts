"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getString } from "@/lib/utils";
import { requireOrgAccess } from "@/lib/auth";
import type { AssetStatus } from "@/lib/types";

const assetSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  inventory_number: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  current_location_id: z.string().optional().or(z.literal("")),
  status: z.enum(["InStock", "Issued", "Maintenance", "WrittenOff"]).optional(),
});

export async function createAsset(formData: FormData) {
  const parsed = assetSchema.safeParse({
    name: getString(formData, "name"),
    type: getString(formData, "type"),
    brand: getString(formData, "brand"),
    model: getString(formData, "model"),
    serial_number: getString(formData, "serial_number"),
    inventory_number: getString(formData, "inventory_number"),
    photo_url: getString(formData, "photo_url"),
    notes: getString(formData, "notes"),
    current_location_id: getString(formData, "current_location_id"),
    status: (getString(formData, "status") as AssetStatus) || "InStock",
  });

  if (!parsed.success) {
    redirect(`/assets/new?error=${encodeURIComponent("Please fill required fields")}`);
  }

  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin"] });
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("assets")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      status: parsed.data.status ?? "InStock",
      current_location_id: parsed.data.current_location_id || null,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/assets/new?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("asset_audit_log").insert({
    asset_id: data!.id,
    organization_id: organizationId,
    action: "CREATE",
    metadata: parsed.data,
    created_by: user.id,
  });

  revalidatePath("/assets");
  redirect(`/assets/${data!.id}`);
}

export async function updateAsset(id: string, formData: FormData) {
  const parsed = assetSchema.safeParse({
    name: getString(formData, "name"),
    type: getString(formData, "type"),
    brand: getString(formData, "brand"),
    model: getString(formData, "model"),
    serial_number: getString(formData, "serial_number"),
    inventory_number: getString(formData, "inventory_number"),
    photo_url: getString(formData, "photo_url"),
    notes: getString(formData, "notes"),
    current_location_id: getString(formData, "current_location_id"),
    status: (getString(formData, "status") as AssetStatus) || "InStock",
  });

  if (!parsed.success) {
    redirect(`/assets/${id}?error=${encodeURIComponent("Invalid data")}`);
  }

  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin"] });
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("assets")
    .update({
      ...parsed.data,
      current_location_id: parsed.data.current_location_id || null,
    })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    redirect(`/assets/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("asset_audit_log").insert({
    asset_id: id,
    organization_id: organizationId,
    action: "UPDATE",
    metadata: parsed.data,
    created_by: user.id,
  });

  revalidatePath(`/assets/${id}`);
  redirect(`/assets/${id}`);
}
