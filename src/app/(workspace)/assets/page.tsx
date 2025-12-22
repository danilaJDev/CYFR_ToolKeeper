import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Filter, Plus, Wrench} from "lucide-react";

const assets = [
    {name: "Перфоратор DeWALT D25133", status: "В работе", location: "Участок А", owner: "Семенов"},
    {name: "Лазерный нивелир Bosch", status: "Свободен", location: "Склад", owner: "—"},
    {name: "Шуруповёрт Makita DHP", status: "На сервисе", location: "Сервис", owner: "—"},
    {name: "Генератор Fubag TI 7000", status: "В работе", location: "Участок C", owner: "Селезнев"},
];

export default function AssetsPage() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Каталог всего оборудования</p>
                    <h1 className="text-2xl font-semibold">Инструменты</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4"/>
                        Фильтры
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Добавить
                    </Button>
                </div>
            </div>

            <Card className="border-primary/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-base">Список инвентаря</CardTitle>
                    <Input placeholder="Поиск по названию или серийному номеру" className="max-w-sm"/>
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
                                <TableRow key={asset.name}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Wrench className="h-4 w-4 text-primary"/>
                                        {asset.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={asset.status === "В работе" ? "secondary" : "outline"}
                                               className="border-primary/30 text-primary">
                                            {asset.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{asset.location}</TableCell>
                                    <TableCell className="text-right text-sm text-muted-foreground">{asset.owner}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
