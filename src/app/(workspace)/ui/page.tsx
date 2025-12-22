import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default function UiKitPage() {
    return (
        <div className="space-y-6 min-w-0">
            <div>
                <h1 className="text-2xl font-semibold">UI Kit</h1>
                <p className="text-sm text-muted-foreground">Быстрые примеры компонентов</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Buttons / Input / Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="destructive">Delete</Button>
                    </div>

                    <div className="max-w-md">
                        <Input placeholder="Search..."/>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge>In stock</Badge>
                        <Badge variant="secondary">Issued</Badge>
                        <Badge variant="outline">Service</Badge>
                    </div>

                    <Separator/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dialog</CardTitle>
                </CardHeader>
                <CardContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Open dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Example modal</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                                Модалки/оверлеи делаем только так — без "самопала".
                            </p>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Table (safe on mobile)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-[720px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Responsible</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>Drill #{i + 1}</TableCell>
                                        <TableCell>In stock</TableCell>
                                        <TableCell>Warehouse</TableCell>
                                        <TableCell>John</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
