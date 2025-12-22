import type {Locale} from "@/i18n/routing";
import {isLocale} from "@/i18n/routing";
import {AppShell} from "@/components/shell/app-shell";

export default async function AppLayout({
                                            children,
                                            params
                                        }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;
    const safeLocale: Locale = isLocale(locale) ? locale : "ru";

    return <AppShell locale={safeLocale}>{children}</AppShell>;
}