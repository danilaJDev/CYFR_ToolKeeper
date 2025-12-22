"use client";

import {useActionState, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import type {LocationRecord} from "@/lib/supabase/queries";
import {createAssetAction} from "@/app/(workspace)/assets/actions";

export function CreateAssetDialog({
                                      locations,
                                      trigger,
                                  }: {
    locations: LocationRecord[];
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(createAssetAction, {error: "", success: false});

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
        }
    }, [state?.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? <Button className="gap-2">Добавить</Button>}
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Новая единица инвентаря</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Наименование</Label>
                        <Input id="name" name="name" required placeholder="Например: Перфоратор DeWALT" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Статус</Label>
                            <Select name="status" defaultValue="В работе">
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="В работе">В работе</SelectItem>
                                    <SelectItem value="Свободен">Свободен</SelectItem>
                                    <SelectItem value="На сервисе">На сервисе</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Локация/склад</Label>
                            <Select name="location" defaultValue={locations[0]?.name}>
                                <SelectTrigger id="location">
                                    <SelectValue placeholder="Выберите склад" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.name}>
                                            {loc.name} {loc.type ? `(${loc.type})` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="owner">Ответственный</Label>
                            <Input id="owner" name="owner" placeholder="ФИО или смена" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="serial_number">Серийный номер/QR</Label>
                            <Input id="serial_number" name="serial_number" placeholder="SN/QR" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note">Комментарий</Label>
                        <Textarea id="note" name="note" placeholder="Состояние, комплектация" />
                    </div>

                    {state?.error ? (
                        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {state.error}
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Отмена
                        </Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
