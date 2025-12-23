import { AppShell } from "@/components/layout/AppShell";
import { createLocation, updateLocation } from "@/app/actions/locations";
import { fetchLocations } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { MapPin, Save } from "lucide-react";

export default async function LocationsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user, organizationId, membership } = await requireOrgAccess();
  const params = await searchParams;
  const error = params?.error;
  const locations = await fetchLocations(organizationId);
  const canEdit = ["owner", "admin"].includes(membership.role);

  return (
    <AppShell userEmail={user.email}>
      <div className="flex items-center gap-3">
        <MapPin className="h-6 w-6 text-emerald-300" />
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Locations</h1>
          <p className="text-sm text-slate-400">Organize storage sites.</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {decodeURIComponent(error)}
        </div>
      )}

      {canEdit && (
        <div className="mt-4 card">
          <h3 className="text-lg font-semibold text-slate-50">Create location</h3>
          <form action={createLocation} className="mt-3 grid gap-3 md:grid-cols-3">
            <input name="name" className="input" placeholder="Name" required />
            <input name="description" className="input md:col-span-2" placeholder="Description" />
            <div className="md:col-span-3 flex justify-end">
              <button className="btn btn-primary" type="submit"><Save className="h-4 w-4" /> Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {locations.map((loc) => (
          <div key={loc.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-50">{loc.name}</p>
                <p className="text-sm text-slate-400">{loc.description}</p>
              </div>
              <span className="text-xs text-slate-500">{formatDate(loc.created_at)}</span>
            </div>
            {canEdit && (
              <form action={(formData) => updateLocation(loc.id, formData)} className="grid gap-2">
                <input name="name" className="input" defaultValue={loc.name} />
                <input name="description" className="input" defaultValue={loc.description ?? ""} />
                <div className="flex justify-end">
                  <button className="btn btn-secondary" type="submit">Update</button>
                </div>
              </form>
            )}
          </div>
        ))}
        {locations.length === 0 && <p className="text-sm text-slate-400">No locations created.</p>}
      </div>
    </AppShell>
  );
}
