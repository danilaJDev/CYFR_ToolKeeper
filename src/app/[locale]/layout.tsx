import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {isLocale, locales} from "@/i18n/routing";

export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;

    if (!isLocale(locale)) {
        // Можно бросить notFound(), но достаточно fallback
        // (Если хочешь — сделаем notFound)
    }

    const messages = await getMessages();

    return (
        <html lang={isLocale(locale) ? locale : "ru"}>
        <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </body>
        </html>
    );
}