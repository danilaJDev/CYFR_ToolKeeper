import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CalendarDays, PlusCircle, ScanLine, ShieldCheck, Truck, Wrench} from "lucide-react";
import {CreateAssetDialog} from "@/components/assets/create-asset-dialog";
import {CreateTransferDialog} from "@/components/transfers/create-transfer-dialog";
import {fetchAssets, fetchLocations, fetchMaintenanceJobs, fetchTransfers} from "@/lib/supabase/queries";

export default async function DashboardPage() {
    const [assetsResponse, transfersResponse, maintenanceResponse, locationsResponse] = await Promise.all([
        fetchAssets(),
        fetchTransfers(),
        fetchMaintenanceJobs(),
        fetchLocations(),
    ]);

    const assets = assetsResponse.data ?? [];
    const transfers = transfersResponse.data ?? [];
    const maintenance = maintenanceResponse.data ?? [];
    const locations = locationsResponse.data ?? [];

    const total = assets.length;
    const inUse = assets.filter((a) => a.status === "В работе").length;
    const servicing = assets.filter((a) => a.status === "На сервисе").length;
    const free = assets.filter((a) => a.status === "Свободен").length;

    const stats = [
        {label: "Всего инструментов", value: total, delta: `${assetsResponse.count ?? total} в базе`},
        {label: "В работе", value: inUse, delta: "активные выдачи"},
        {label: "На сервисе", value: servicing, delta: "контроль ТО"},
        {label: "Свободно", value: free, delta: "готовы к выдаче"},
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Контроль инвентаря и потоков выдачи</p>
                    <h1 className="text-2xl font-semibold">Панель управления</h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/assets?focus=scan">
                            <ScanLine className="h-4 w-4"/>
                            Отсканировать
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="gap-2" href="#maintenance">
                        <Link href="#maintenance">
                            <CalendarDays className="h-4 w-4"/>
                            Планы обслуживания
                        </Link>
                    </Button>
                    <CreateAssetDialog
                        locations={locations}
                        trigger={(
                            <Button className="gap-2">
                                <PlusCircle className="h-4 w-4"/>
                                Новая запись
                            </Button>
                        )}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <Card key={item.label} className="border-primary/15 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground font-medium">{item.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-semibold text-foreground">{item.value}</div>
                                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                                    {item.delta}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <Card className="border-primary/15">
                    <CardHeader className="flex-row items-center justify-between gap-2">
                        <div>
                            <CardTitle>Текущие перемещения</CardTitle>
                            <p className="text-sm text-muted-foreground">Кто и куда везёт оборудование</p>
                        </div>
                        <Badge className="bg-primary/15 text-primary" variant="secondary">В
                            работе {transfers.length}</Badge>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Инструмент</TableHead>
                                    <TableHead>Откуда</TableHead>
                                    <TableHead>Куда</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead className="text-right">ETA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transfers.slice(0, 8).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-primary"/>
                                            {item.asset_name}
                                        </TableCell>
                                        <TableCell>{item.from_location ?? "—"}</TableCell>
                                        <TableCell>{item.to_location ?? "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-primary/40 text-primary">
                                                {item.status ?? "В пути"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            className="text-right text-sm text-muted-foreground">{item.eta ?? "—"}</TableCell>
                                    </TableRow>
                                ))}
                                {transfers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Нет активных перемещений. Создайте заявку, чтобы начать.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <Card id="maintenance" className="border-primary/15">
                        <CardHeader className="pb-2 flex-row items-center justify-between gap-3">
                            <div>
                                <CardTitle>Сервис и контроль</CardTitle>
                                <p className="text-sm text-muted-foreground">Плановые работы и статусы</p>
                            </div>
                            <CreateTransferDialog
                                assets={assets}
                                locations={locations}
                                trigger={<Button size="sm" variant="outline">Создать перемещение</Button>}
                            />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {maintenance.map((item) => (
                                <div key={item.id} className="space-y-2 rounded-xl border border-primary/10 p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium flex items-center gap-2">
                                                <Wrench className="h-4 w-4 text-primary"/>
                                                {item.asset_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{item.status ?? "Без статуса"}</p>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                            {item.progress ?? 0}%
                                        </Badge>
                                    </div>
                                    <Progress value={item.progress ?? 0} className="h-2"/>
                                </div>
                            ))}
                            {maintenance.length === 0 && (
                                <div
                                    className="rounded-xl border border-dashed border-primary/20 p-4 text-sm text-muted-foreground">
                                    Пока нет планов обслуживания. Добавьте запись из сервиса или через импорт Supabase.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/15">
                        <CardHeader className="pb-2">
                            <CardTitle>Безопасность</CardTitle>
                            <p className="text-sm text-muted-foreground">Проверки и допуски сотрудников</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-primary/10 p-3">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-primary"/>
                                    <div>
                                        <div className="font-medium">СИЗ и допуски</div>
                                        <p className="text-xs text-muted-foreground">Обновляйте статусы в Supabase
                                            таблице team_members</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">Актуально</Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-primary/10 p-3">
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="h-5 w-5 text-primary"/>
                                    <div>
                                        <div className="font-medium">План ТО на неделю</div>
                                        <p className="text-xs text-muted-foreground">Добавляйте задачи в
                                            maintenance_jobs</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="#maintenance">Открыть</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}