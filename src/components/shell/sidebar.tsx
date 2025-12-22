import Link from "next/link";
import {navItems} from "./nav-items";
import {cn} from "@/lib/utils";

export function Sidebar({className}: { className?: string }) {
    return (
        <aside className={cn("h-full w-64 border-r bg-background", className)}>
            <div className="h-14 px-4 flex items-center border-b">
                <div className="font-semibold">CYFR Toolkeeper</div>
            </div>

            <nav className="p-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <item.icon className="h-4 w-4"/>
                        <span>{item.title}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}