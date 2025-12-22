import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function AssetDetailsPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {data: asset, error} = await supabase
        .from("assets")
        .select("id,name,asset_tag,category,status,notes,created_at")
        .eq("id", id)
        .single();

    if (error || !asset) {
        return <div>Asset not found</div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-semibold">{asset.name}</h1>
                <p className="text-sm text-muted-foreground">Status: {asset.status}</p>
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
        </div>
    );
}