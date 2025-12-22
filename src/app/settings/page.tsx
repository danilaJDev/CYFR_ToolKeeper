import { AppShell } from "@/components/layout/AppShell";
import { requireOrgAccess } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Role } from "@/lib/types";

type MemberRow = {
  id: string;
  role: Role;
  user_id: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};

export default async function SettingsPage() {
  const { user, organizationId, profile, membership } = await requireOrgAccess();
  const supabase = createServerSupabaseClient();
  const { data: members } = await supabase
    .from("organization_members")
    .select("id, role, user_id, created_at, profiles:profiles(full_name)")
    .eq("organization_id", organizationId);

  return (
    <AppShell userEmail={user.email}>
      <h1 className="text-2xl font-bold text-slate-50">Settings</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-50">Profile</h3>
          <p className="text-sm text-slate-300">{profile?.full_name ?? "Unnamed"}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
          <p className="mt-2 text-xs text-slate-500">User ID: {user.id}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-50">Organization</h3>
          <p className="text-sm text-slate-300">Default organization: {profile?.default_organization_id ?? "n/a"}</p>
          <p className="text-sm text-slate-400">Role: {membership.role}</p>
        </div>
      </div>
      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-slate-50">Members</h3>
        <div className="mt-3 space-y-2">
          {(members as MemberRow[] | null ?? []).map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/50 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-slate-100">{m.profiles?.full_name ?? m.user_id}</p>
                <p className="text-xs text-slate-400">Role: {m.role}</p>
              </div>
              <span className="text-xs text-slate-500">{formatDate(m.created_at)}</span>
            </div>
          ))}
          {(members ?? []).length === 0 && <p className="text-sm text-slate-400">Invite team members to collaborate.</p>}
        </div>
      </div>
    </AppShell>
  );
}
