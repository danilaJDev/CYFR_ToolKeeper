"use client";

import {useMemo} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type LocationDTO = {
    id: string;
    name: string;
    type: string;
};

export function AssetTransfer({
                                  assetId,
                                  locations,
                                  defaultWarehouseId,
                                  action,
                                  formAction,
                                  buttonLabel,
                              }: {
    assetId: string;
    locations: LocationDTO[];
    defaultWarehouseId?: string | null;
    action: "issue" | "move" | "return";
    buttonLabel: string;
    formAction: (formData: FormData) => void;
}) {
    const defaultTo = useMemo(() => {
        if (action === "return") return defaultWarehouseId ?? locations[0]?.id ?? "";
        return locations[0]?.id ?? "";
    }, [action, defaultWarehouseId, locations]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={action === "return" ? "secondary" : "outline"}>{buttonLabel}</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {action === "issue" ? "Issue asset" : action === "move" ? "Move asset" : "Return asset"}
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction} className="grid gap-4">
                    <input type="hidden" name="asset_id" value={assetId}/>
                    <input type="hidden" name="action" value={action}/>

                    <div className="grid gap-2">
                        <Label>To location</Label>
                        <Select name="to_location_id" defaultValue={defaultTo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select location"/>
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                        {l.name} ({l.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Note</Label>
                        <Textarea name="note" placeholder="Комментарий…"/>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button type="submit">Confirm</Button>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}