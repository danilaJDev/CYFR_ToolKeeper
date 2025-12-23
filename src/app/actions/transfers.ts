"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerActionSupabaseClient } from "@/lib/supabase/server";
import { getString } from "@/lib/utils";
import { requireOrgAccess } from "@/lib/auth";
import type { AssetStatus, TransferType } from "@/lib/types";

const transferSchema = z.object({
  asset_id: z.string().min(1),
  type: z.enum(["ISSUE", "RETURN", "MOVE", "WRITE_OFF", "MAINTENANCE"]),
  from_location_id: z.string().optional().or(z.literal("")),
  to_location_id: z.string().optional().or(z.literal("")),
  issued_to_user_id: z.string().optional().or(z.literal("")),
  quantity: z.coerce.number().min(1).default(1),
  note: z.string().optional(),
});

function nextStatus(type: TransferType, current: AssetStatus): AssetStatus {
  switch (type) {
    case "ISSUE":
      return "Issued";
    case "RETURN":
      return "InStock";
    case "MAINTENANCE":
      return "Maintenance";
    case "WRITE_OFF":
      return "WrittenOff";
    case "MOVE":
    default:
      return current;
  }
}

export async function createTransfer(formData: FormData) {
  const parsed = transferSchema.safeParse({
    asset_id: getString(formData, "asset_id"),
    type: getString(formData, "type"),
    from_location_id: getString(formData, "from_location_id"),
    to_location_id: getString(formData, "to_location_id"),
    issued_to_user_id: getString(formData, "issued_to_user_id"),
    quantity: getString(formData, "quantity"),
    note: getString(formData, "note"),
  });

  if (!parsed.success) {
    redirect(`/transfers?error=${encodeURIComponent("Invalid transfer data")}`);
  }

  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin", "member"] });
  const supabase = await createServerActionSupabaseClient();

  const { data: asset } = await supabase
    .from("assets")
    .select("id,status,current_location_id,organization_id")
    .eq("id", parsed.data.asset_id)
    .single();

  if (!asset || asset.organization_id !== organizationId) {
    redirect(`/transfers?error=${encodeURIComponent("Asset not found")}`);
  }

  if (parsed.data.type === "ISSUE" && (asset.status === "Issued" || asset.status === "WrittenOff")) {
    redirect(`/assets/${asset.id}?error=${encodeURIComponent("Cannot issue already issued or written-off asset")}`);
  }

  if (parsed.data.type === "RETURN" && asset.status !== "Issued") {
    redirect(`/assets/${asset.id}?error=${encodeURIComponent("Cannot return asset that is not issued")}`);
  }

  const updatedStatus = nextStatus(parsed.data.type, asset.status as AssetStatus);
  const { error } = await supabase.from("asset_transfers").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
    from_location_id: parsed.data.from_location_id || asset.current_location_id,
    to_location_id: parsed.data.to_location_id || asset.current_location_id,
    issued_to_user_id: parsed.data.issued_to_user_id || null,
  });

  if (error) {
    redirect(`/assets/${asset.id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase
    .from("assets")
    .update({
      current_location_id: parsed.data.to_location_id || asset.current_location_id,
      status: updatedStatus,
    })
    .eq("id", asset.id)
    .eq("organization_id", organizationId);

  await supabase.from("asset_audit_log").insert({
    asset_id: asset.id,
    organization_id: organizationId,
    action: `TRANSFER_${parsed.data.type}`,
    metadata: parsed.data,
    created_by: user.id,
  });

  revalidatePath(`/assets/${asset.id}`);
  revalidatePath("/transfers");
}
