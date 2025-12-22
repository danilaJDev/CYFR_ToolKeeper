import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Bell} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {fetchSettings} from "@/lib/supabase/queries";
import {SettingsForm} from "@/components/settings/settings-form";

export default async function SettingsPage() {
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();
    const profileId = data.user?.id;
    const settingsResponse = profileId ? await fetchSettings(profileId) : null;

    const settings = settingsResponse?.data ?? {
        company_name: "",
        warehouse_name: "",
        notify_receipts: true,
        notify_service: true,
    };

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
                        <SettingsForm
                            initialCompany={settings.company_name ?? ""}
                            initialWarehouse={settings.warehouse_name ?? ""}
                            initialNotifyReceipts={!!settings.notify_receipts}
                            initialNotifyService={!!settings.notify_service}
                        />
                    </CardContent>
                </Card>

                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-primary"/>
                            Оповещения
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        Настройки уведомлений управляются выше и сохраняются в Supabase таблице settings. Проверьте,
                        что переменные окружения Supabase заданы корректно.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
