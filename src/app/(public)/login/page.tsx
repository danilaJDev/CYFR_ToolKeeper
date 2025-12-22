"use client";

import {useSearchParams} from "next/navigation";
import {useState} from "react";
import {signInAction, signUpAction} from "./actions";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    const errorMessage = searchParams.get("error");
    const successMessage = searchParams.get("success");

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await signInAction(formData);
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await signUpAction(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">CYFR ToolKeeper</h1>
                    <p className="text-slate-400">Учёт инструмента без хаоса</p>
                </div>

                {/* Alerts */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{decodeURIComponent(errorMessage)}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 text-sm">{decodeURIComponent(successMessage)}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setMode("signin")}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                mode === "signin"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                            }`}
                        >
                            Вход
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                mode === "signup"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                            }`}
                        >
                            Регистрация
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Рабочая почта
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Пароль
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-6"
                        >
                            {mode === "signin" ? "Войти" : "Создать аккаунт"}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <p className="text-slate-400 text-sm text-center">
                            {mode === "signin"
                                ? "Ещё нет аккаунта? Нажмите «Регистрация»"
                                : "Уже есть аккаунт? Нажмите «Вход»"}
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-slate-400 text-sm">Контроль выдач</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">📍</div>
                        <p className="text-slate-400 text-sm">Локации</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">🔔</div>
                        <p className="text-slate-400 text-sm">Напоминания</p>
                    </div>
                </div>
            </div>
        </div>
    );
}