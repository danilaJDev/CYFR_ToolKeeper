import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {defaultLocale, isLocale, locales, type Locale} from "@/i18n/routing";

export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: { locale: Locale | string };
}) {
    const locale = isLocale(params.locale) ? params.locale : defaultLocale;
    const messages = await getMessages({locale});

    return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
}