"use client";

import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import Link from "next/link";
import {navItems} from "./nav-items";
import {QuickSearch} from "./quick-search";

import {signOutAction} from "@/app/(workspace)/actions";

type TopbarProps = {
    user: { email: string; fullName?: string } | null;
};

export function Topbar({user}: TopbarProps) {
    const initials = user?.fullName
        ? user.fullName
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase();

    return (
        <header className="h-16 border-b border-primary/10 bg-white/85 backdrop-blur flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30">
            {/* Mobile menu */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Открыть меню">
                            <Menu className="h-4 w-4"/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-0 w-72">
                        <SheetHeader className="p-4 border-b border-primary/10 bg-gradient-to-r from-white to-[#eef4ff]">
                            <SheetTitle>Навигация</SheetTitle>
                        </SheetHeader>

                        <div className="p-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary/10"
                                >
                                    <item.icon className="h-4 w-4"/>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge ? (
                                        <span
                                            className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:block font-semibold text-primary">Рабочее пространство</div>

            <div className="flex-1">
                <QuickSearch/>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <Button variant="outline" className="hidden sm:inline-flex">Добавить запись</Button>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm text-primary">
                        <div className="h-8 w-8 rounded-full bg-primary/20 grid place-items-center font-semibold">
                            {initials ?? "?"}
                        </div>
                        <div className="leading-tight">
                            <div className="font-medium text-foreground">{user?.fullName ?? user?.email ?? "Гость"}</div>
                            <div className="text-xs text-muted-foreground">{user ? "Пользователь" : "Не авторизован"}</div>
                        </div>
                    </div>

                    <form action={signOutAction}>
                        <Button variant="ghost" type="submit" size="sm">
                            Выйти
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    );
}