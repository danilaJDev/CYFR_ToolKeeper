import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowRightLeft, Clock4, Truck} from "lucide-react";

const transfers = [
    {id: "TR-541", tool: "Отбойный молоток", from: "Склад", to: "Участок А", status: "В пути", eta: "1 ч"},
    {id: "TR-538", tool: "Перфоратор", from: "Участок B", to: "Склад", status: "Получен", eta: "—"},
    {id: "TR-527", tool: "Рация Motorola", from: "Склад", to: "Участок C", status: "Ожидает", eta: "14:40"},
];

export default function TransfersPage() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Движение оборудования между складами и объектами</p>
                <h1 className="text-2xl font-semibold">Выдачи и возвраты</h1>
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
                                        {item.tool}
                                    </TableCell>
                                    <TableCell>{item.from}</TableCell>
                                    <TableCell>{item.to}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-primary/30 text-primary">{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center gap-2 justify-end text-muted-foreground">
                                        <Clock4 className="h-4 w-4"/>
                                        {item.eta}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
