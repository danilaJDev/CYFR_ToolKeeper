import {Sidebar} from "./sidebar";
import {Topbar} from "./topbar";
import {createClient} from "@/lib/supabase/server";

type AppShellProps = { children: React.ReactNode };

export async function AppShell({children}: AppShellProps) {
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    const userProfile = data.user
        ? {
            email: data.user.email ?? "",
            fullName: data.user.user_metadata?.full_name as string | undefined,
        }
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface via-[#eaf3ff] to-white text-foreground">
            <div className="md:grid md:grid-cols-[17rem_1fr]">
                <div className="hidden md:block h-screen sticky top-0">
                    <Sidebar/>
                </div>

                <div className="min-w-0">
                    <Topbar user={userProfile}/>

                    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-6">
                        <div className="min-w-0 rounded-2xl bg-card/80 backdrop-blur shadow-lg border border-primary/10 p-6 sm:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}