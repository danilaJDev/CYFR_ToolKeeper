import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {signOutAction} from "./actions";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    if (!data.user) {
        redirect("/login");
    }

    return (
        <main className="p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm opacity-70">
                        Вы вошли как: {data.user.email}
                    </p>
                </div>

                <form action={signOutAction}>
                    <button className="rounded-lg border px-3 py-2">Выйти</button>
                </form>
            </div>

            <div className="mt-8 rounded-2xl border p-6">
                <p className="opacity-70">
                    Следующий шаг: сделаем сущности “Assets / Locations / Transfers”.
                </p>
            </div>
        </main>
    );
}