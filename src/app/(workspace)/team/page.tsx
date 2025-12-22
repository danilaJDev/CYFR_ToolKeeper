import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Users} from "lucide-react";

const team = [
    {name: "Иванова Вера", role: "Администратор", badge: "Онлайн"},
    {name: "Семенов Павел", role: "Кладовщик", badge: "Смена"},
    {name: "Ким Алексей", role: "Инженер", badge: "Поле"},
    {name: "Егорова Анна", role: "Офис", badge: "Доступ"},
];

export default function TeamPage() {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ответственные за инвентарь</p>
                <h1 className="text-2xl font-semibold">Команда</h1>
            </div>

            <Card className="border-primary/10">
                <CardHeader className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-base">Состав</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {team.map((member) => (
                        <div key={member.name} className="flex items-center gap-3 rounded-xl border border-primary/10 p-3">
                            <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="font-medium">{member.name}</div>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">{member.badge}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
