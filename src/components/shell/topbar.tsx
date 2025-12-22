"use client";

import {Menu} from "lucide-react";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {Sidebar} from "./sidebar";

export function Topbar() {
    return (
        <header className="h-14 border-b bg-background flex items-center gap-3 px-4">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Open menu">
                            <Menu className="h-4 w-4"/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-0 w-72">
                        <SheetHeader>
                            <VisuallyHidden>
                                <SheetTitle>Меню</SheetTitle>
                            </VisuallyHidden>
                        </SheetHeader>

                        <Sidebar className="w-72 border-r-0"/>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="font-medium">Workspace</div>
            <div className="ml-auto flex items-center gap-2"/>
        </header>
    );
}