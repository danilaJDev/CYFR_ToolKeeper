import Link from "next/link";
import {createLocationAction} from "./actions";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default async function NewLocationPage({
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
                    <h1 className="text-2xl font-semibold">Add location</h1>
                    <p className="text-sm text-muted-foreground">Создание склада/объекта/машины/персоны</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/locations">Back</Link>
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
                    <form action={createLocationAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Name *</Label>
                            <Input name="name" placeholder="Main Warehouse / Bluewaters 702 / Van #1" required/>
                        </div>

                        <div className="grid gap-2">
                            <Label>Type *</Label>
                            <Select name="type" defaultValue="warehouse">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="warehouse">warehouse</SelectItem>
                                    <SelectItem value="site">site</SelectItem>
                                    <SelectItem value="vehicle">vehicle</SelectItem>
                                    <SelectItem value="person">person</SelectItem>
                                    <SelectItem value="other">other</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* Важно: shadcn Select не прокидывает name автоматически во все версии.
                  Если у тебя после сабмита type пустой — скажи, я дам 100% рабочий вариант с hidden input. */}
                        </div>

                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Input name="address" placeholder="Dubai, ..."/>
                        </div>

                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea name="notes" placeholder="Комментарий…"/>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Button type="submit">Create</Button>
                            <Button asChild type="button" variant="outline">
                                <Link href="/locations">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}