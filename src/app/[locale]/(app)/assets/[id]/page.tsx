import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AssetTransfer} from "@/components/assets/asset-transfer";
import {performTransferAction} from "./actions";

export default async function AssetDetailsPage({
                                                   params,
                                                   searchParams,
                                               }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ error?: string }>;
}) {
    const {id} = await params;
    const sp = await searchParams;
    const errorMsg = sp.error ? decodeURIComponent(sp.error) : "";

    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {data: profile} = await supabase.from("profiles").select("org_id").single();
    if (!profile?.org_id) return <div className="text-sm">Profile/org not found</div>;

    const {data: asset, error: assetErr} = await supabase
        .from("assets")
        .select("id,name,asset_tag,category,status,notes,created_at,current_location_id")
        .eq("id", id)
        .single();

    if (assetErr || !asset) return <div>Asset not found</div>;

    const {data: locations} = await supabase
        .from("locations")
        .select("id,name,type")
        .eq("org_id", profile.org_id)
        .order("created_at", {ascending: false});

    const {data: currentLocation} = asset.current_location_id
        ? await supabase.from("locations").select("id,name,type").eq("id", asset.current_location_id).single()
        : {data: null as { id: string; name: string; type: string; } | null};

    const {data: transfers} = await supabase
        .from("transfers")
        .select("id,action,created_at,note,from_location_id,to_location_id")
        .eq("asset_id", asset.id)
        .order("created_at", {ascending: false})
        .limit(10);

    const defaultWarehouseId = (locations ?? []).find((l) => l.type === "warehouse")?.id ?? null;

    return (
        <div className="space-y-6 max-w-4xl">
            {errorMsg ? (
                <div className="rounded-lg border p-3 text-sm">
                    <span className="font-medium">Ошибка:</span> {errorMsg}
                </div>
            ) : null}

            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{asset.name}</h1>
                <p className="text-sm text-muted-foreground">
                    Status: {asset.status} • Location:{" "}
                    {currentLocation ? `${currentLocation.name} (${currentLocation.type})` : "—"}
                </p>
            </div>

            <div className="flex gap-2 flex-wrap">
                <AssetTransfer
                    assetId={asset.id}
                    locations={locations ?? []}
                    defaultWarehouseId={defaultWarehouseId}
                    action="issue"
                    buttonLabel="Issue"
                    formAction={performTransferAction}
                />
                <AssetTransfer
                    assetId={asset.id}
                    locations={locations ?? []}
                    defaultWarehouseId={defaultWarehouseId}
                    action="move"
                    buttonLabel="Move"
                    formAction={performTransferAction}
                />
                <AssetTransfer
                    assetId={asset.id}
                    locations={locations ?? []}
                    defaultWarehouseId={defaultWarehouseId}
                    action="return"
                    buttonLabel="Return"
                    formAction={performTransferAction}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div><span className="opacity-70">Tag:</span> {asset.asset_tag ?? "—"}</div>
                    <div><span className="opacity-70">Category:</span> {asset.category ?? "—"}</div>
                    <div><span className="opacity-70">Notes:</span> {asset.notes ?? "—"}</div>
                    <div><span className="opacity-70">Created:</span> {new Date(asset.created_at).toLocaleString()}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent transfers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {(transfers ?? []).length === 0 ? (
                        <div className="text-muted-foreground">Пока нет движений.</div>
                    ) : (
                        <ul className="space-y-2">
                            {(transfers ?? []).map((t) => (
                                <li key={t.id} className="rounded-md border p-3">
                                    <div className="font-medium">{t.action}</div>
                                    <div className="text-muted-foreground">
                                        {new Date(t.created_at).toLocaleString()}
                                        {t.note ? ` • ${t.note}` : ""}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
