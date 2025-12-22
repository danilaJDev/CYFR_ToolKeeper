import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {defaultLocale, isLocale, type Locale} from "@/i18n/routing";

export default async function LocaleIndex({
                                              params,
                                          }: {
    params: { locale: Locale | string };
}) {
    const safeLocale = isLocale(params.locale) ? params.locale : defaultLocale;

    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    redirect(data.user ? `/${safeLocale}/dashboard` : `/${safeLocale}/login`);
}