import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin, Warehouse} from "lucide-react";

const locations = [
    {name: "Склад", type: "Центральный", assets: 86},
    {name: "Участок А", type: "Стройплощадка", assets: 21},
    {name: "Участок B", type: "Стройплощадка", assets: 14},
    {name: "Сервис", type: "Подрядчик", assets: 7},
];

export default function LocationsPage() {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Где находится инвентарь прямо сейчас</p>
                <h1 className="text-2xl font-semibold">Локации</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {locations.map((loc) => (
                    <Card key={loc.name} className="border-primary/10">
                        <CardHeader className="flex-row items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                                <Warehouse className="h-5 w-5"/>
                            </div>
                            <div>
                                <CardTitle className="text-base">{loc.name}</CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3"/>
                                    {loc.type}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">Единиц оборудования</span>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">{loc.assets}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
