import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {isLocale} from "@/i18n/routing";

export default async function LocaleIndex({
                                              params,
                                          }: {
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;
    const safeLocale = isLocale(locale) ? locale : "ru";

    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    redirect(data.user ? `/${safeLocale}/dashboard` : `/${safeLocale}/login`);
}