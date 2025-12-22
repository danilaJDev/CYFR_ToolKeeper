import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {defaultLocale, isLocale} from "@/i18n/routing";
import {getRequestLocale} from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "CYFR ToolKeeper",
    description: "Учёт инструментов и ресурсов компании",
};

export default async function RootLayout({
                                            children,
                                        }: Readonly<{ children: React.ReactNode }>) {
    const requestLocale = await getRequestLocale();
    const lang = isLocale(requestLocale) ? requestLocale : defaultLocale;

    return (
        <html lang={lang} className="min-h-full bg-surface">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-foreground`}>
                {children}
            </body>
        </html>
    );
}
