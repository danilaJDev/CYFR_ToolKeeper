import {signInAction, signUpAction} from "./actions";

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const sp = await searchParams;
    const error = sp.error ? decodeURIComponent(sp.error) : "";
    const success = sp.success ? decodeURIComponent(sp.success) : "";

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">CYFR Toolkeeper</h1>
                <p className="text-sm opacity-70 mt-1">Вход для команды</p>

                {error ? (
                    <div className="mt-4 rounded-lg border p-3 text-sm">
                        <span className="font-medium">Ошибка:</span> {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="mt-4 rounded-lg border p-3 text-sm">{success}</div>
                ) : null}

                {/* ОДНА форма */}
                <form className="mt-6 space-y-3">
                    <label className="block">
                        <span className="text-sm">Email</span>
                        <input
                            name="email"
                            type="email"
                            required
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            placeholder="name@company.com"
                            autoComplete="email"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm">Пароль</span>
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            formAction={signInAction}
                            className="w-full rounded-lg border px-3 py-2 font-medium"
                        >
                            Войти
                        </button>

                        <button
                            formAction={signUpAction}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>

                <p className="text-xs opacity-60 mt-4">
                    * Регистрация нужна только на старте. Потом сделаем приглашения/роли.
                </p>
            </div>
        </main>
    );
}