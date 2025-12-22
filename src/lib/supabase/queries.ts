import {createClient} from "@/lib/supabase/server";

export type AssetRecord = {
    id: string;
    name: string;
    status: string | null;
    owner: string | null;
    serial_number: string | null;
    location_id: string | null;
    location_name: string | null;
    updated_at?: string | null;
};

export type LocationRecord = {
    id: string;
    name: string;
    type: string | null;
};

export type TransferRecord = {
    id: string;
    asset_id: string | null;
    asset_name: string | null;
    from_location: string | null;
    to_location: string | null;
    status: string | null;
    eta: string | null;
    note: string | null;
    created_at: string | null;
};

export type TeamMember = {
    id: string;
    full_name: string;
    role: string | null;
    presence: string | null;
};

export type MaintenanceJob = {
    id: string;
    asset_name: string;
    status: string | null;
    progress: number | null;
};

export async function fetchAssets(search?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("assets")
        .select("id,name,status,owner,serial_number,location_id,location_name,updated_at")
        .order("updated_at", {ascending: false, nullsFirst: false});

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    return query;
}

export async function fetchLocations() {
    const supabase = await createClient();
    return supabase.from("locations").select("id,name,type").order("name");
}

export async function fetchTransfers() {
    const supabase = await createClient();
    return supabase
        .from("transfers")
        .select("id,asset_id,asset_name,from_location,to_location,status,eta,note,created_at")
        .order("created_at", {ascending: false});
}

export async function fetchTeamMembers() {
    const supabase = await createClient();
    return supabase.from("team_members").select("id,full_name,role,presence").order("full_name");
}

export async function fetchMaintenanceJobs() {
    const supabase = await createClient();
    return supabase.from("maintenance_jobs").select("id,asset_name,status,progress").order("progress", {ascending: false});
}

export async function fetchSettings(profileId: string) {
    const supabase = await createClient();
    return supabase
        .from("settings")
        .select("company_name,warehouse_name,notify_receipts,notify_service")
        .eq("id", profileId)
        .single();
}