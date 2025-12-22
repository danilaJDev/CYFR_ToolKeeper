import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Asset, AssetAuditLog, AssetTransfer, Location } from "@/lib/types";

export async function fetchDashboard(organizationId: string) {
  const supabase = createServerSupabaseClient();
  const [assets, locations, transfers] = await Promise.all([
    supabase
      .from("assets")
      .select("id,status")
      .eq("organization_id", organizationId),
    supabase
      .from("locations")
      .select("id")
      .eq("organization_id", organizationId),
    supabase
      .from("asset_transfers")
      .select("*, assets(name), profiles:created_by(full_name)")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const assetRows = assets.data ?? [];
  const stats = {
    total: assetRows.length,
    inStock: assetRows.filter((a) => a.status === "InStock").length,
    issued: assetRows.filter((a) => a.status === "Issued").length,
    maintenance: assetRows.filter((a) => a.status === "Maintenance").length,
    locations: locations.data?.length ?? 0,
    transfers: transfers.data ?? [],
  };

  return stats;
}

export async function fetchAssets(organizationId: string, params: { search?: string; status?: string; location?: string }) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("assets")
    .select("*, locations:current_location_id(name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,serial_number.ilike.%${params.search}%,inventory_number.ilike.%${params.search}%`
    );
  }
  if (params.status) query = query.eq("status", params.status);
  if (params.location) query = query.eq("current_location_id", params.location);

  const { data } = await query;
  return data as (Asset & { locations?: { name: string } | null })[];
}

export async function fetchAsset(organizationId: string, id: string) {
  const supabase = createServerSupabaseClient();
  const { data: asset } = await supabase
    .from("assets")
    .select("*, locations:current_location_id(name)")
    .eq("organization_id", organizationId)
    .eq("id", id)
    .single();

  const { data: transfers } = await supabase
    .from("asset_transfers")
    .select("*, from:from_location_id(name), to:to_location_id(name)")
    .eq("organization_id", organizationId)
    .eq("asset_id", id)
    .order("created_at", { ascending: false });

  const { data: audit } = await supabase
    .from("asset_audit_log")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("asset_id", id)
    .order("created_at", { ascending: false });

  return { asset, transfers: (transfers ?? []) as AssetTransfer[], audit: (audit ?? []) as AssetAuditLog[] };
}

export async function fetchLocations(organizationId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name");
  return (data ?? []) as Location[];
}

export async function fetchTransfers(
  organizationId: string,
  filters: { type?: string; location?: string; from?: string; to?: string }
) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("asset_transfers")
    .select("*, assets:asset_id(name), from:from_location_id(name), to:to_location_id(name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.location) query = query.or(
    `from_location_id.eq.${filters.location},to_location_id.eq.${filters.location}`
  );

  const { data } = await query;
  return (data ?? []) as (AssetTransfer & { assets?: { name: string } | null; from?: Location | null; to?: Location | null })[];
}
