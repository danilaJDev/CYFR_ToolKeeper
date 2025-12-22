import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CalendarDays, PlusCircle, ScanLine, ShieldCheck, Truck, Wrench} from "lucide-react";

const stats = [
    {label: "Всего инструментов", value: "128", delta: "+4 за неделю"},
    {label: "В работе", value: "46", delta: "12 в выдаче"},
    {label: "На сервисе", value: "6", delta: "3 ожидают запчасти"},
    {label: "Свободно", value: "76", delta: "готовы к выдаче"},
];

const transfers = [
    {tool: "Перфоратор DeWALT", from: "Склад", to: "Участок А", status: "В пути", eta: "Сегодня"},
    {tool: "Лазерный нивелир", from: "Участок B", to: "Склад", status: "Принят", eta: "12:30"},
    {tool: "Гайковерт Milwaukee", from: "Сервис", to: "Склад", status: "Готов", eta: "Завтра"},
];

const maintenance = [
    {name: "Шуруповёрт Makita DDF", status: "Диагностика", progress: 40},
    {name: "Генератор Fubag", status: "Запчасти в пути", progress: 65},
    {name: "Бетономешалка", status: "Сервис завершён", progress: 100},
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Контроль инвентаря и потоков выдачи</p>
                    <h1 className="text-2xl font-semibold">Панель управления</h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2">
                        <ScanLine className="h-4 w-4"/>
                        Отсканировать
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <CalendarDays className="h-4 w-4"/>
                        Планы обслуживания
                    </Button>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4"/>
                        Новая запись
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <Card key={item.label} className="border-primary/10 shadow-sm">
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
                <Card className="border-primary/10">
                    <CardHeader className="flex-row items-center justify-between gap-2">
                        <div>
                            <CardTitle>Текущие перемещения</CardTitle>
                            <p className="text-sm text-muted-foreground">Кто и куда везёт оборудование</p>
                        </div>
                        <Badge className="bg-primary/15 text-primary" variant="secondary">В работе 5</Badge>
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
                                {transfers.map((item) => (
                                    <TableRow key={item.tool}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-primary"/>
                                            {item.tool}
                                        </TableCell>
                                        <TableCell>{item.from}</TableCell>
                                        <TableCell>{item.to}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-primary/40 text-primary">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">{item.eta}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <Card className="border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle>Сервис и контроль</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {maintenance.map((item) => (
                                <div key={item.name} className="space-y-2 rounded-xl border border-primary/10 p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium flex items-center gap-2">
                                                <Wrench className="h-4 w-4 text-primary"/>
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{item.status}</p>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                            {item.progress}%
                                        </Badge>
                                    </div>
                                    <Progress value={item.progress} className="h-2"/>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10">
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
                                        <p className="text-xs text-muted-foreground">24 сотрудника прошли проверку</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">Актуально</Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-primary/10 p-3">
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="h-5 w-5 text-primary"/>
                                    <div>
                                        <div className="font-medium">План ТО на неделю</div>
                                        <p className="text-xs text-muted-foreground">8 позиций в расписании</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline">Открыть</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
