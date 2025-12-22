import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightCircle, ShieldCheck, Wrench } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
        <ShieldCheck className="h-4 w-4" /> Secure tool tracking
      </div>
      <h1 className="mt-6 text-4xl font-bold text-slate-50 sm:text-5xl">Keep every tool accounted for.</h1>
      <p className="mt-4 text-lg text-slate-300">
        ToolKeeper delivers multi-organization inventory, movement history, and audit-ready logs powered by Supabase and Next.js 16.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/register" className="btn btn-primary">
          Get started <ArrowRightCircle className="h-4 w-4" />
        </Link>
        <Link href="/login" className="btn btn-secondary">
          Sign in
        </Link>
      </div>
      <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
        {["Audit log", "Location moves", "Issue/Return"].map((item) => (
          <div key={item} className="card">
            <Wrench className="mb-3 h-6 w-6 text-emerald-300" />
            <p className="text-lg font-semibold text-slate-50">{item}</p>
            <p className="text-sm text-slate-400">Granular history across organizations with strict RLS enforcement.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
