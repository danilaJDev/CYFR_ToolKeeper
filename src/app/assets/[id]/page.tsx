import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AppShell } from "@/components/layout/AppShell";
import { updateAsset } from "@/app/actions/assets";
import { createTransfer } from "@/app/actions/transfers";
import { fetchAsset, fetchLocations } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Save, Send, Undo2 } from "lucide-react";

export default async function AssetDetailPage({ params, searchParams }: { params: { id: string }; searchParams: Promise<{ error?: string }> }) {
  const { user, organizationId, membership } = await requireOrgAccess();
  const paramsResult = await searchParams;
  const error = paramsResult?.error;
  const [assetData, locations] = await Promise.all([fetchAsset(organizationId, params.id), fetchLocations(organizationId)]);
  const asset = assetData.asset;

  if (!asset) {
    return <div className="text-slate-200">Asset not found.</div>;
  }

  const canEdit = ["owner", "admin"].includes(membership.role);

  return (
    <AppShell userEmail={user.email}>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <ArrowLeft className="h-4 w-4" /> <Link href="/assets">Back</Link>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {decodeURIComponent(error)}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Asset</p>
              <h1 className="text-2xl font-semibold text-slate-50">{asset.name}</h1>
            </div>
            <span className="badge badge-info">{asset.status}</span>
          </div>
          {canEdit && (
            <form action={(formData) => updateAsset(asset.id, formData)} className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input className="input" name="name" defaultValue={asset.name} required />
              </div>
              <div>
                <label className="label">Type</label>
                <input className="input" name="type" defaultValue={asset.type ?? ""} />
              </div>
              <div>
                <label className="label">Brand</label>
                <input className="input" name="brand" defaultValue={asset.brand ?? ""} />
              </div>
              <div>
                <label className="label">Model</label>
                <input className="input" name="model" defaultValue={asset.model ?? ""} />
              </div>
              <div>
                <label className="label">Serial</label>
                <input className="input" name="serial_number" defaultValue={asset.serial_number ?? ""} />
              </div>
              <div>
                <label className="label">Inventory #</label>
                <input className="input" name="inventory_number" defaultValue={asset.inventory_number ?? ""} />
              </div>
              <div>
                <label className="label">Location</label>
                <select className="input" name="current_location_id" defaultValue={asset.current_location_id ?? ""}>
                  <option value="">Select</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" name="status" defaultValue={asset.status}>
                  <option value="InStock">In stock</option>
                  <option value="Issued">Issued</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="WrittenOff">Written off</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Notes</label>
                <textarea className="input min-h-[100px]" name="notes" defaultValue={asset.notes ?? ""} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="btn btn-primary" type="submit"><Save className="h-4 w-4" /> Save</button>
              </div>
            </form>
          )}
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-slate-50">Actions</h3>
          <Dialog.Root>
            <Dialog.Trigger className="btn btn-secondary w-full"><Send className="h-4 w-4" /> Issue / Move</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-xl shadow-black/50">
                <Dialog.Title className="text-lg font-semibold">Issue / Move</Dialog.Title>
                <form action={createTransfer} className="mt-4 space-y-3">
                  <input type="hidden" name="asset_id" value={asset.id} />
                  <input type="hidden" name="from_location_id" value={asset.current_location_id ?? ""} />
                  <div>
                    <label className="label">Type</label>
                    <select name="type" className="input" defaultValue="ISSUE">
                      <option value="ISSUE">Issue</option>
                      <option value="MOVE">Move</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="WRITE_OFF">Write off</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">To location</label>
                    <select name="to_location_id" className="input" defaultValue={asset.current_location_id ?? ""}>
                      <option value="">Unchanged</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Quantity</label>
                    <input name="quantity" type="number" className="input" defaultValue={1} min={1} />
                  </div>
                  <div>
                    <label className="label">Note</label>
                    <textarea name="note" className="input min-h-[80px]" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Dialog.Close className="btn btn-secondary">Cancel</Dialog.Close>
                    <button className="btn btn-primary" type="submit">Submit</button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger className="btn btn-secondary w-full"><Undo2 className="h-4 w-4" /> Return</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-xl shadow-black/50">
                <Dialog.Title className="text-lg font-semibold">Return</Dialog.Title>
                <form action={createTransfer} className="mt-4 space-y-3">
                  <input type="hidden" name="asset_id" value={asset.id} />
                  <input type="hidden" name="type" value="RETURN" />
                  <div>
                    <label className="label">To location</label>
                    <select name="to_location_id" className="input" defaultValue={asset.current_location_id ?? ""}>
                      <option value="">Current</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Note</label>
                    <textarea name="note" className="input min-h-[80px]" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Dialog.Close className="btn btn-secondary">Cancel</Dialog.Close>
                    <button className="btn btn-primary" type="submit">Return</button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <div className="pt-3 text-xs text-slate-400">
            Status: {asset.status} • Location: {asset.current_location_id ?? "Unassigned"}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-50">Transfer history</h3>
          <div className="mt-4 space-y-3">
            {assetData.transfers.map((t) => (
              <div key={t.id} className="rounded-lg border border-slate-800/60 bg-slate-950/50 px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="badge badge-info">{t.type}</span>
                  <span className="text-xs text-slate-400">{formatDate(t.created_at)}</span>
                </div>
                <p className="text-sm text-slate-200">From {t.from?.name ?? t.from_location_id ?? "-"} → {t.to?.name ?? t.to_location_id ?? "-"}</p>
                {t.note && <p className="text-xs text-slate-400">{t.note}</p>}
              </div>
            ))}
            {assetData.transfers.length === 0 && <p className="text-sm text-slate-400">No transfers yet.</p>}
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-50">Audit log</h3>
          <div className="mt-4 space-y-3">
            {assetData.audit.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-800/60 bg-slate-950/50 px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="badge badge-warning">{log.action}</span>
                  <span className="text-xs text-slate-400">{formatDate(log.created_at)}</span>
                </div>
                <pre className="mt-2 overflow-x-auto rounded bg-slate-900/60 p-2 text-xs text-slate-200">
{JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            ))}
            {assetData.audit.length === 0 && <p className="text-sm text-slate-400">No audit events.</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
