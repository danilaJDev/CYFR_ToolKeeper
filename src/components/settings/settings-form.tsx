"use client";

import {useActionState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {updateSettingsAction} from "@/app/(workspace)/settings/actions";

export function SettingsForm({
                                  initialCompany,
                                  initialWarehouse,
                                  initialNotifyReceipts,
                                  initialNotifyService,
                              }: {
    initialCompany: string;
    initialWarehouse: string;
    initialNotifyReceipts: boolean;
    initialNotifyService: boolean;
}) {
    const [state, formAction] = useActionState(updateSettingsAction, {error: "", success: false});
    const message = state?.error ?? (state?.success ? "Настройки сохранены" : null);

    return (
        <form action={formAction} className="grid gap-3">
            <div className="space-y-1">
                <Label htmlFor="company">Название</Label>
                <Input id="company" name="company" defaultValue={initialCompany} placeholder="ООО СтройИнж" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="warehouse">Центральный склад</Label>
                <Input id="warehouse" name="warehouse" defaultValue={initialWarehouse} placeholder="Например: Склад №1" />
            </div>

            <div className="grid gap-3 rounded-lg border border-primary/10 p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Чеки выдачи</div>
                        <p className="text-xs text-muted-foreground">Отправлять письмо при каждом перемещении</p>
                    </div>
                    <Switch name="notify_receipts" defaultChecked={initialNotifyReceipts} aria-label="Чеки выдачи" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Напоминание о сервисе</div>
                        <p className="text-xs text-muted-foreground">За 2 дня до планового ТО</p>
                    </div>
                    <Switch name="notify_service" defaultChecked={initialNotifyService} aria-label="Напоминания о сервисе" />
                </div>
            </div>

            {message ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">{message}</div>
            ) : null}

            <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">Сохранить</Button>
            </div>
        </form>
    );
}
