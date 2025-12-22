import Link from "next/link";
import {createAssetAction} from "./actions";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";

export default async function NewAssetPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<{ error?: string }>;
}) {
    const sp = await searchParams;
    const error = sp.error ? decodeURIComponent(sp.error) : "";

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold">Add asset</h1>
                    <p className="text-sm text-muted-foreground">Создание новой карточки инструмента</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/assets">Back</Link>
                </Button>
            </div>

            {error ? (
                <div className="rounded-lg border p-3 text-sm">
                    <span className="font-medium">Ошибка:</span> {error}
                </div>
            ) : null}

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createAssetAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm">Name *</label>
                            <Input name="name" placeholder="Makita drill…" required/>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm">Asset tag (inventory/QR)</label>
                            <Input name="asset_tag" placeholder="CYFR-000123"/>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm">Category</label>
                            <Input name="category" placeholder="Power tools / Hand tools…"/>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm">Notes</label>
                            <textarea
                                name="notes"
                                className="min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                placeholder="Состояние, комплектность, замечания…"
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Button type="submit">Create</Button>
                            <Button asChild type="button" variant="outline">
                                <Link href="/assets">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}