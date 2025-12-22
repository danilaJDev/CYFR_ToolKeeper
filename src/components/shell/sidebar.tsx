"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {navItems} from "./nav-items";
import {cn} from "@/lib/utils";

export function Sidebar({className}: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "h-full w-[17rem] border-r bg-gradient-to-b from-white/90 via-[#e8f1ff]/80 to-white/90 backdrop-blur shadow-sm",
                "flex flex-col",
                className,
            )}
        >
            <div className="h-16 px-4 flex items-center border-b/60 gap-2">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary grid place-items-center font-semibold">TK</div>
                <div>
                    <div className="font-semibold tracking-tight">ToolKeeper</div>
                    <p className="text-xs text-muted-foreground">Учёт инструментов</p>
                </div>
            </div>

            <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                                "hover:bg-primary/10 hover:text-primary",
                                isActive && "bg-primary/15 text-primary shadow-sm",
                            )}
                        >
                            <item.icon className="h-4 w-4"/>
                            <span className="flex-1">{item.label}</span>
                            {item.badge ? (
                                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}