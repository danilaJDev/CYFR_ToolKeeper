import { AppShell } from "@/components/layout/AppShell";
import { fetchDashboard } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { Activity, Archive, CheckCircle2, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

type DashboardTransfer = {
  id: string;
  type: string;
  from_location_id: string | null;
  to_location_id: string | null;
  quantity: number;
  created_at: string;
  assets?: { name: string } | null;
};

export default async function DashboardPage() {
  const { user, organizationId } = await requireOrgAccess();
  const stats = await fetchDashboard(organizationId);

  const cards = [
    { label: "Assets", value: stats.total, icon: Archive },
    { label: "In stock", value: stats.inStock, icon: CheckCircle2 },
    { label: "Issued", value: stats.issued, icon: Activity },
    { label: "Locations", value: stats.locations, icon: MapPin },
  ];

  return (
    <AppShell userEmail={user.email}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-50">{card.value}</p>
                </div>
                <Icon className="h-6 w-6 text-emerald-300" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">Recent transfers</h2>
        </div>
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
              {(stats.transfers as DashboardTransfer[]).map((t) => (
                <tr key={t.id}>
                  <td>{t.assets?.name ?? ""}</td>
                  <td><span className="badge badge-info">{t.type}</span></td>
                  <td>{t.from_location_id ?? "-"}</td>
                  <td>{t.to_location_id ?? "-"}</td>
                  <td>{t.quantity}</td>
                  <td>{formatDate(t.created_at)}</td>
                </tr>
              ))}
              {stats.transfers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">No transfers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
