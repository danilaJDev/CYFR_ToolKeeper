import Link from "next/link";
import {navItems} from "./nav-items";
import {cn} from "@/lib/utils";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n/routing";

export async function Sidebar({className, locale}: { className?: string; locale: Locale }) {
    const t = await getTranslations();

    return (
        <aside className={cn("h-full w-64 border-r bg-card/60 backdrop-blur shadow-sm", className)}>
            <div className="h-14 px-4 flex items-center border-b/60">
                <div className="font-semibold tracking-tight">{t("app.title")}</div>
            </div>

            <nav className="p-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={`/${locale}${item.href}`}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                        <item.icon className="h-4 w-4"/>
                        <span>{t(`nav.${item.key}`)}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}