"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getString } from "@/lib/utils";
import { requireOrgAccess } from "@/lib/auth";

const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function createLocation(formData: FormData) {
  const parsed = locationSchema.safeParse({
    name: getString(formData, "name"),
    description: getString(formData, "description"),
  });

  if (!parsed.success) {
    redirect(`/locations?error=${encodeURIComponent("Name is required")}`);
  }

  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin"] });
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("locations").insert({
    ...parsed.data,
    organization_id: organizationId,
  });

  if (error) {
    redirect(`/locations?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("asset_audit_log").insert({
    asset_id: "-",
    organization_id: organizationId,
    action: "LOCATION_CREATE",
    metadata: parsed.data,
    created_by: user.id,
  });

  revalidatePath("/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  const parsed = locationSchema.safeParse({
    name: getString(formData, "name"),
    description: getString(formData, "description"),
  });

  if (!parsed.success) {
    redirect(`/locations?error=${encodeURIComponent("Invalid data")}`);
  }

  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin"] });
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("locations")
    .update(parsed.data)
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    redirect(`/locations?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("asset_audit_log").insert({
    asset_id: "-",
    organization_id: organizationId,
    action: "LOCATION_UPDATE",
    metadata: { id, ...parsed.data },
    created_by: user.id,
  });

  revalidatePath("/locations");
}
