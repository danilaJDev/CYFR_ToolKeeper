import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default async function AssetsPage() {
    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();

    if (!userData.user) redirect("/login");

    // берём org_id пользователя
    const {data: profile, error: profileError} = await supabase
        .from("profiles")
        .select("org_id")
        .single();

    if (profileError || !profile?.org_id) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Assets</h1>
                <p className="text-sm text-muted-foreground">
                    Не найден профиль пользователя (profiles). Проверь SQL триггер handle_new_user().
                </p>
            </div>
        );
    }

    const {data: assets, error} = await supabase
        .from("assets")
        .select("id,name,asset_tag,category,status,created_at")
        .eq("org_id", profile.org_id)
        .order("created_at", {ascending: false});

    return (
        <div className="space-y-6 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold">Assets</h1>
                    <p className="text-sm text-muted-foreground">Инструменты и оборудование</p>
                </div>

                <Button asChild>
                    <Link href="/assets/new">Add asset</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List</CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <p className="text-sm">
                            Ошибка загрузки: {error.message}
                        </p>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Tag</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(assets ?? []).map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell className="font-medium">
                                                <Link className="hover:underline" href={`/assets/${a.id}`}>
                                                    {a.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{a.asset_tag ?? "—"}</TableCell>
                                            <TableCell>{a.category ?? "—"}</TableCell>
                                            <TableCell>{a.status}</TableCell>
                                            <TableCell>{new Date(a.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}

                                    {assets?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-sm text-muted-foreground">
                                                Пусто. Нажми “Add asset”.
                                            </TableCell>
                                        </TableRow>
                                    ) : null}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}