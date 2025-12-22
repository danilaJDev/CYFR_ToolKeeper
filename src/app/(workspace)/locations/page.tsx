import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {MapPin, Plus, Warehouse} from "lucide-react";
import {fetchAssets, fetchLocations} from "@/lib/supabase/queries";
import {CreateLocationDialog} from "@/components/locations/create-location-dialog";

export default async function LocationsPage() {
    const [locationsResponse, assetsResponse] = await Promise.all([
        fetchLocations(),
        fetchAssets(),
    ]);

    const locations = locationsResponse.data ?? [];
    const assets = assetsResponse.data ?? [];

    const counts = assets.reduce<Record<string, number>>((acc, asset) => {
        if (asset.location_name) {
            acc[asset.location_name] = (acc[asset.location_name] ?? 0) + 1;
        }
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Где находится инвентарь прямо сейчас</p>
                    <h1 className="text-3xl font-semibold">Локации</h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/assets">Все инструменты</Link>
                    </Button>
                    <CreateLocationDialog
                        trigger={(
                            <Button className="gap-2">
                                <Plus className="h-4 w-4"/>
                                Новая локация
                            </Button>
                        )}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {locations.map((loc) => (
                    <Card key={loc.id} className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex-row items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
                                <Warehouse className="h-5 w-5"/>
                            </div>
                            <div>
                                <CardTitle className="text-lg">{loc.name}</CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3"/>
                                    {loc.type ?? "Без типа"}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Единиц оборудования
                                <span className="block text-xs">по данным Supabase</span>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">{counts[loc.name] ?? 0}</Badge>
                        </CardContent>
                        <CardContent className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{loc.type ?? "Любая"}</span>
                                <span className="hidden sm:inline">Обновляйте записи прямо из Supabase</span>
                            </div>
                            <Link href={`/assets?q=${encodeURIComponent(loc.name)}`} className="text-primary underline font-medium">
                                Открыть список
                            </Link>
                        </CardContent>
                    </Card>
                ))}
                {locations.length === 0 && (
                    <Card className="border-dashed border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-base">Локации не найдены</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-3">
                            <p>Добавьте записи в таблицу locations в Supabase — карты обновятся автоматически.</p>
                            <CreateLocationDialog/>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
