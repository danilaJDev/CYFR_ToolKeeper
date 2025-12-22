import {getRequestConfig} from "next-intl/server";
import {defaultLocale, isLocale} from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
    const locale = isLocale(await requestLocale) ? (await requestLocale) : defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});