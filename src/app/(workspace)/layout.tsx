import {redirect} from "next/navigation";
import {AppShell} from "@/components/shell/app-shell";
import {createClient} from "@/lib/supabase/server";

export default async function WorkspaceLayout({children}: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    if (!data.user) {
        redirect("/login");
    }

    return <AppShell>{children}</AppShell>;
}
