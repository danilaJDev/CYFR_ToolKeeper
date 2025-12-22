"use client";

import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import type {Locale} from "@/i18n/routing";

const LOCALES: Locale[] = ["ru", "en"];

function replaceLocale(pathname: string, nextLocale: Locale) {
    const parts = pathname.split("/").filter(Boolean);

    // Если первый сегмент похож на локаль — заменяем
    if (parts.length > 0 && (parts[0] === "ru" || parts[0] === "en")) {
        parts[0] = nextLocale;
        return "/" + parts.join("/");
    }

    // Если локали нет — просто добавляем
    return "/" + [nextLocale, ...parts].join("/");
}

export function LanguageSwitcher({locale}: { locale: Locale }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-1 rounded-lg border p-1">
            {LOCALES.map((l) => (
                <Button
                    key={l}
                    type="button"
                    variant={l === locale ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.replace(replaceLocale(pathname, l))}
                    aria-label={l === "ru" ? "Переключить на русский" : "Switch to English"}
                >
                    {l.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}