import Link from "next/link";
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
        <main className="min-h-screen grid place-items-center bg-gradient-to-br from-surface via-[#e6f0ff] to-white p-4">
            <div className="w-full max-w-5xl grid gap-6 rounded-3xl border border-primary/10 bg-white/70 shadow-xl backdrop-blur p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-primary">CYFR ToolKeeper</p>
                        <h1 className="text-3xl font-semibold leading-tight">Учёт инструмента без хаоса</h1>
                        <p className="text-sm text-muted-foreground">Единая база, прозрачные выдачи и напоминания о сервисе.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="rounded-2xl bg-primary/10 p-4 shadow-inner">
                            <p className="font-semibold text-primary">Контроль выдач</p>
                            <p className="text-muted-foreground mt-1">QR-коды, смены и расписание сервисов.</p>
                        </div>
                        <div className="rounded-2xl bg-secondary p-4 shadow-inner">
                            <p className="font-semibold text-primary">Локации</p>
                            <p className="text-muted-foreground mt-1">Склад, стройплощадки и подрядчики.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Вход для команды</h2>
                            <p className="text-sm text-muted-foreground">Используйте рабочую почту</p>
                        </div>
                        <Link href="/" className="text-xs text-primary underline">На главную</Link>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            <span className="font-medium">Ошибка:</span> {error}
                        </div>
                    ) : null}

                    {success ? (
                        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
                            {success}
                        </div>
                    ) : null}

                    <form className="mt-6 space-y-4">
                        <label className="block space-y-2">
                            <span className="text-sm">Email</span>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-1 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 shadow-inner"
                                placeholder="name@company.com"
                                autoComplete="email"
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm">Пароль</span>
                            <input
                                name="password"
                                type="password"
                                required
                                className="mt-1 w-full rounded-lg border border-primary/20 bg-white px-3 py-2 shadow-inner"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                formAction={signInAction}
                                className="w-full rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                            >
                                Войти
                            </button>

                            <button
                                formAction={signUpAction}
                                className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-primary shadow-sm"
                            >
                                Зарегистрироваться
                            </button>
                        </div>
                    </form>

                    <p className="text-xs text-muted-foreground mt-4">
                        * Регистрация нужна только на старте. Потом сделаем приглашения/роли.
                    </p>
                </div>
            </div>
        </main>
    );
}
