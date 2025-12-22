import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default async function LocationsPage() {
    const supabase = await createClient();
    const {data: userData} = await supabase.auth.getUser();
    if (!userData.user) redirect("/login");

    const {data: profile, error: pErr} = await supabase.from("profiles").select("org_id").single();
    if (pErr || !profile?.org_id) {
        return <div className="text-sm">Не найден profile/org. Проверь profiles trigger.</div>;
    }

    const {data: locations, error} = await supabase
        .from("locations")
        .select("id,name,type,address,created_at")
        .eq("org_id", profile.org_id)
        .order("created_at", {ascending: false});

    return (
        <div className="space-y-6 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold">Locations</h1>
                    <p className="text-sm text-muted-foreground">Склады, объекты, машины, сотрудники</p>
                </div>
                <Button asChild>
                    <Link href="/locations/new">Add location</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List</CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <p className="text-sm">Ошибка: {error.message}</p>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(locations ?? []).map((l) => (
                                        <TableRow key={l.id}>
                                            <TableCell className="font-medium">{l.name}</TableCell>
                                            <TableCell>{l.type}</TableCell>
                                            <TableCell>{l.address ?? "—"}</TableCell>
                                            <TableCell>{new Date(l.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {locations?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-sm text-muted-foreground">
                                                Пока нет локаций. Создай хотя бы склад (warehouse).
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