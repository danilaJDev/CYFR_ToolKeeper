import {getRequestConfig} from "next-intl/server";
import {defaultLocale, isLocale} from "./routing";
import { Locale } from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
    const awaitedLocale = await requestLocale;
    const locale: Locale = awaitedLocale && isLocale(awaitedLocale) ? awaitedLocale : defaultLocale;

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
