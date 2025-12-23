import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { fetchAssets, fetchLocations } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { PlusCircle, Search } from "lucide-react";

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; location?: string }> }) {
  const { user, organizationId } = await requireOrgAccess();
  const params = await searchParams;
  const [assets, locations] = await Promise.all([
    fetchAssets(organizationId, { search: params?.q, status: params?.status, location: params?.location }),
    fetchLocations(organizationId),
  ]);

  return (
    <AppShell userEmail={user.email}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Assets</h1>
          <p className="text-sm text-slate-400">Search and manage equipment.</p>
        </div>
        <Link href="/assets/new" className="btn btn-primary">
          <PlusCircle className="h-4 w-4" /> Add asset
        </Link>
      </div>

      <form className="mt-4 grid gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 md:grid-cols-4">
        <label className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-500" />
          <input className="input" name="q" placeholder="Search name/serial" defaultValue={params?.q} />
        </label>
        <select className="input" name="status" defaultValue={params?.status}>
          <option value="">Status</option>
          <option value="InStock">In stock</option>
          <option value="Issued">Issued</option>
          <option value="Maintenance">Maintenance</option>
          <option value="WrittenOff">Written off</option>
        </select>
        <select className="input" name="location" defaultValue={params?.location}>
          <option value="">Location</option>
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
              <th>Name</th>
              <th>Status</th>
              <th>Serial</th>
              <th>Location</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-800/40">
                <td className="font-semibold text-emerald-200">
                  <Link href={`/assets/${asset.id}`}>{asset.name}</Link>
                </td>
                <td><span className="badge badge-info">{asset.status}</span></td>
                <td>{asset.serial_number ?? "-"}</td>
                <td>{asset.locations?.name ?? "-"}</td>
                <td>{formatDate(asset.created_at)}</td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">No assets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
