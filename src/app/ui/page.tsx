import { AppShell } from "@/components/layout/AppShell";
import { requireOrgAccess } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export default async function UiPage() {
  const { user } = await requireOrgAccess();
  return (
    <AppShell userEmail={user.email}>
      <h1 className="text-2xl font-bold text-slate-50">UI Kit</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="badge badge-info inline-flex items-center gap-1"><Sparkles className="h-4 w-4" /> Badge</div>
          <p className="mt-2 text-sm text-slate-300">Use badges to highlight statuses.</p>
        </div>
        <div className="card space-y-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
        </div>
        <div className="card">
          <label className="label">Input</label>
          <input className="input" placeholder="Type here" />
        </div>
      </div>
    </AppShell>
  );
}
