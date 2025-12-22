import {Sidebar} from "./sidebar";
import {Topbar} from "./topbar";

export function AppShell({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <div className="md:grid md:grid-cols-[16rem_1fr]">
                <div className="hidden md:block h-screen sticky top-0">
                    <Sidebar/>
                </div>

                <div className="min-w-0">
                    <Topbar/>
                    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <div className="min-w-0">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}