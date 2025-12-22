"use client";

import {useMemo} from "react";
import {usePathname, useRouter, useSearchParams} from "next-intl/navigation";
import {Button} from "@/components/ui/button";
import type {Locale} from "@/i18n/routing";

const LOCALES: Locale[] = ["ru", "en"];

export function LanguageSwitcher({locale}: { locale: Locale }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = useMemo(() => {
        const params = searchParams.toString();
        return params ? `?${params}` : "";
    }, [searchParams]);

    const replaceLocale = (nextLocale: Locale) => {
        const parts = pathname.split("/").filter(Boolean);

        if (parts.length > 0 && LOCALES.includes(parts[0] as Locale)) {
            parts[0] = nextLocale;
        } else {
            parts.unshift(nextLocale);
        }

        return `/${parts.join("/")}${query}`;
    };

    return (
        <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 p-1 shadow-sm backdrop-blur">
            {LOCALES.map((l) => (
                <Button
                    key={l}
                    type="button"
                    variant={l === locale ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.replace(replaceLocale(l))}
                    aria-label={l === "ru" ? "Переключить на русский" : "Switch to English"}
                >
                    {l.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}