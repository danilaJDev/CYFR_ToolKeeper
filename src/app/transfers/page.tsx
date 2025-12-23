import { AppShell } from "@/components/layout/AppShell";
import { fetchLocations, fetchTransfers } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Filter } from "lucide-react";

export default async function TransfersPage({ searchParams }: { searchParams: Promise<{ type?: string; location?: string }> }) {
  const { user, organizationId } = await requireOrgAccess();
  const params = await searchParams;
  const [transfers, locations] = await Promise.all([
    fetchTransfers(organizationId, { type: params?.type, location: params?.location }),
    fetchLocations(organizationId),
  ]);

  return (
    <AppShell userEmail={user.email}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Transfers</h1>
          <p className="text-sm text-slate-400">Movement history with filters.</p>
        </div>
      </div>

      <form className="mt-4 flex flex-wrap gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <select name="type" className="input w-auto" defaultValue={params?.type}>
          <option value="">All types</option>
          <option value="ISSUE">Issue</option>
          <option value="RETURN">Return</option>
          <option value="MOVE">Move</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="WRITE_OFF">Write off</option>
        </select>
        <select name="location" className="input w-auto" defaultValue={params?.location}>
          <option value="">Any location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">Apply</button>
      </form>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Qty</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t.id}>
                <td>{t.assets?.name ?? t.asset_id}</td>
                <td><span className="badge badge-info">{t.type}</span></td>
                <td>{t.from?.name ?? t.from_location_id ?? "-"}</td>
                <td>{t.to?.name ?? t.to_location_id ?? "-"}</td>
                <td>{t.quantity}</td>
                <td>{formatDate(t.created_at)}</td>
              </tr>
            ))}
            {transfers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">No transfers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
