import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Bell} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Общие параметры аккаунта</p>
                <h1 className="text-2xl font-semibold">Настройки</h1>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle>Компания</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="company">Название</Label>
                            <Input id="company" placeholder="ООО СтройИнж" defaultValue="CYFR"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="warehouse">Центральный склад</Label>
                            <Input id="warehouse" placeholder="Например: Склад №1" defaultValue="Северный склад"/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full sm:w-auto">Сохранить</Button>
                    </CardFooter>
                </Card>

                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-primary"/>
                            Оповещения
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-primary/10 p-3">
                            <div>
                                <div className="font-medium">Чеки выдачи</div>
                                <p className="text-xs text-muted-foreground">Отправлять письмо при каждом перемещении</p>
                            </div>
                            <Switch defaultChecked aria-label="Чеки выдачи"/>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-primary/10 p-3">
                            <div>
                                <div className="font-medium">Напоминание о сервисе</div>
                                <p className="text-xs text-muted-foreground">За 2 дня до планового ТО</p>
                            </div>
                            <Switch defaultChecked aria-label="Напоминания о сервисе"/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
