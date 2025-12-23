import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, UserPlus } from "lucide-react";
import { register } from "@/app/actions/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-8 shadow-lg shadow-black/40">
      <div className="flex items-center gap-2 text-emerald-300">
        <ArrowLeft className="h-4 w-4" /> <Link href="/">Back</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Create account</h1>
        <p className="text-sm text-slate-400">You will start with a personal organization you can share later.</p>
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          <AlertTriangle className="h-4 w-4" /> {decodeURIComponent(error)}
        </div>
      )}
      <form action={register} className="space-y-4">
        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input className="input" name="fullName" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="input" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="input" name="password" type="password" minLength={6} required />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          <UserPlus className="h-4 w-4" /> Sign up
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already registered? <Link href="/login" className="text-emerald-300 hover:underline">Login</Link>
      </p>
    </div>
  );
}
