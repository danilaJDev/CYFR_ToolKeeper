"use client";

import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";

export function Topbar() {
    return (
        <header className="h-14 border-b bg-background flex items-center gap-3 px-4">
            {/* Mobile menu */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Open menu">
                            <Menu className="h-4 w-4"/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-0 w-72">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="font-medium">Workspace</div>

            <div className="ml-auto flex items-center gap-3">
            </div>
        </header>
    );
}
