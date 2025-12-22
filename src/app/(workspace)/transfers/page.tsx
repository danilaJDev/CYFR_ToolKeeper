import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowRightLeft, Clock4, Truck} from "lucide-react";
import {fetchAssets, fetchLocations, fetchTransfers} from "@/lib/supabase/queries";
import {CreateTransferDialog} from "@/components/transfers/create-transfer-dialog";

export default async function TransfersPage() {
    const [transfersResponse, assetsResponse, locationsResponse] = await Promise.all([
        fetchTransfers(),
        fetchAssets(),
        fetchLocations(),
    ]);

    const transfers = transfersResponse.data ?? [];
    const assets = assetsResponse.data ?? [];
    const locations = locationsResponse.data ?? [];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Движение оборудования между складами и объектами</p>
                    <h1 className="text-2xl font-semibold">Выдачи и возвраты</h1>
                </div>
                <CreateTransferDialog assets={assets} locations={locations}/>
            </div>

            <Card className="border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-primary"/>
                        Активные заявки
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Инструмент</TableHead>
                                <TableHead>Откуда</TableHead>
                                <TableHead>Куда</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead className="text-right">ETA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-primary"/>
                                        {item.asset_name ?? "Инструмент"}
                                    </TableCell>
                                    <TableCell>{item.from_location ?? "—"}</TableCell>
                                    <TableCell>{item.to_location ?? "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-primary/30 text-primary">{item.status ?? "В пути"}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center gap-2 justify-end text-muted-foreground">
                                        <Clock4 className="h-4 w-4"/>
                                        {item.eta ?? "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transfers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        Пока нет перемещений. Создайте заявку, чтобы зафиксировать выдачу или возврат.
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
