import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Filter, Plus, Wrench} from "lucide-react";
import {CreateAssetDialog} from "@/components/assets/create-asset-dialog";
import {fetchAssets, fetchLocations} from "@/lib/supabase/queries";
import {cn} from "@/lib/utils";

export default async function AssetsPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{ q?: string; focus?: string }>;
}) {
    const params = await searchParams;
    const search = params.q?.trim() ?? "";
    const focus = params.focus;

    const [assetsResponse, locationsResponse] = await Promise.all([
        fetchAssets(search),
        fetchLocations(),
    ]);

    const assets = assetsResponse.data ?? [];
    const locations = locationsResponse.data ?? [];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Каталог всего оборудования</p>
                    <h1 className="text-2xl font-semibold">Инструменты</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <form className="flex flex-wrap gap-2" method="get">
                        <Input
                            name="q"
                            defaultValue={search}
                            placeholder="Поиск по названию или серийному номеру"
                            className="max-w-sm"
                        />
                        <Button type="submit" variant="outline" className="gap-2">
                            <Filter className="h-4 w-4"/>
                            Фильтр
                        </Button>
                    </form>
                    <CreateAssetDialog
                        locations={locations}
                        trigger={(
                            <Button className="gap-2">
                                <Plus className="h-4 w-4"/>
                                Добавить
                            </Button>
                        )}
                    />
                </div>
            </div>

            <Card className="border-primary/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-base">Список инвентаря</CardTitle>
                    <p className="text-sm text-muted-foreground">{assets.length} позиций из Supabase</p>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Наименование</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Локация</TableHead>
                                <TableHead className="text-right">Ответственный</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset) => (
                                <TableRow key={asset.id} className={cn(focus === asset.id && "bg-primary/5")}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Wrench className="h-4 w-4 text-primary"/>
                                        {asset.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={asset.status === "В работе" ? "secondary" : "outline"}
                                            className="border-primary/30 text-primary"
                                        >
                                            {asset.status ?? "Без статуса"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{asset.location_name ?? "Не указано"}</TableCell>
                                    <TableCell
                                        className="text-right text-sm text-muted-foreground">{asset.owner ?? "—"}</TableCell>
                                </TableRow>
                            ))}
                            {assets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Нет данных. Добавьте инструмент, и он появится здесь сразу после записи в
                                        Supabase.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}