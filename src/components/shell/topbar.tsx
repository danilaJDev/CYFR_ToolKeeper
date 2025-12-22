"use client";

import {Menu} from "lucide-react";
import type {Locale} from "@/lib/i18n/routing";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {LanguageSwitcher} from "./language-switcher";
import {useTranslations} from "next-intl";

export function Topbar({locale}: { locale: Locale }) {
    const t = useTranslations();

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
                            <SheetTitle>{t("app.menu")}</SheetTitle>
                        </SheetHeader>

                        {/* Sidebar — server component, поэтому в Sheet лучше пока оставить простой вариант:
                если возникнут ошибки, сделаем отдельный MobileSidebar client-only */}
                        {/* Вариант без SSR-сайдбара в Sheet (если будет ругаться) — скажи, я дам патч */}
                    </SheetContent>
                </Sheet>
            </div>

            <div className="font-medium">{t("app.workspace")}</div>

            <div className="ml-auto flex items-center gap-3">
                <LanguageSwitcher locale={locale}/>
            </div>
        </header>
    );
}
