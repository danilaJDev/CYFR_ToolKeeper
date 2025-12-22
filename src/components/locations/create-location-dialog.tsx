"use client";

import {useActionState, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {createLocationAction} from "@/app/(workspace)/locations/actions";

export function CreateLocationDialog({trigger}: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(createLocationAction, {error: "", success: false});

    useEffect(() => {
        if (!state?.success) return;

        const timer = setTimeout(() => setOpen(false), 50);
        return () => clearTimeout(timer);
    }, [state?.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? <Button className="gap-2">Новая локация</Button>}
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Добавить локацию</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Название</Label>
                        <Input id="name" name="name" required placeholder="Склад №1" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Тип/категория</Label>
                        <Input id="type" name="type" placeholder="Склад, объект, подрядчик" />
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
