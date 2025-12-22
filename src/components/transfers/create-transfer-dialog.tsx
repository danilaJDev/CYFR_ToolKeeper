"use client";

import {useActionState, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {AssetRecord, LocationRecord} from "@/lib/supabase/queries";
import {createTransferAction} from "@/app/(workspace)/transfers/actions";

export function CreateTransferDialog({
                                         assets,
                                         locations,
                                         trigger,
                                     }: {
    assets: AssetRecord[];
    locations: LocationRecord[];
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(createTransferAction, {error: "", success: false});

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
        }
    }, [state?.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? <Button className="gap-2">Новая заявка</Button>}
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Новое перемещение</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="asset_name">Инструмент</Label>
                        <Select name="asset_name" defaultValue={assets[0]?.name}>
                            <SelectTrigger id="asset_name">
                                <SelectValue placeholder="Выберите инструмент"/>
                            </SelectTrigger>
                            <SelectContent>
                                {assets.map((asset) => (
                                    <SelectItem key={asset.id} value={asset.name}>
                                        {asset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="from_location">Откуда</Label>
                            <Select name="from_location" defaultValue={assets[0]?.location_name ?? locations[0]?.name}>
                                <SelectTrigger id="from_location">
                                    <SelectValue placeholder="Текущая точка"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.name}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="to_location">Куда</Label>
                            <Select name="to_location" defaultValue={locations[0]?.name}>
                                <SelectTrigger id="to_location">
                                    <SelectValue placeholder="Локация назначения"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.name}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Статус</Label>
                            <Select name="status" defaultValue="В пути">
                                <SelectTrigger id="status">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="В пути">В пути</SelectItem>
                                    <SelectItem value="Ожидает">Ожидает</SelectItem>
                                    <SelectItem value="Получен">Получен</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="eta">ETA / время</Label>
                            <Input id="eta" name="eta" placeholder="Напр. 12:30 или Сегодня"/>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note">Комментарий</Label>
                        <Textarea id="note" name="note" placeholder="Кто везёт, контактный телефон, комментарии"/>
                    </div>

                    {state?.error ? (
                        <div
                            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {state.error}
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Отмена
                        </Button>
                        <Button type="submit">Создать</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}