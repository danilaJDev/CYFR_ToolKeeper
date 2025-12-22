import {getRequestConfig} from "next-intl/server";
import {defaultLocale, isLocale} from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
    const resolvedLocale = await requestLocale;
    const locale = isLocale(resolvedLocale) ? resolvedLocale : defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});