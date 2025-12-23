import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { createAsset } from "@/app/actions/assets";
import { fetchLocations } from "@/lib/db";
import { requireOrgAccess } from "@/lib/auth";
import { ArrowLeft, Save } from "lucide-react";

export default async function NewAssetPage() {
  const { user, organizationId } = await requireOrgAccess({ roles: ["owner", "admin"] });
  const locations = await fetchLocations(organizationId);

  return (
    <AppShell userEmail={user.email}>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <ArrowLeft className="h-4 w-4" /> <Link href="/assets">Back</Link>
      </div>
      <div className="card">
        <h1 className="text-xl font-semibold text-slate-50">Add asset</h1>
        <form action={createAsset} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input className="input" name="name" required />
          </div>
          <div>
            <label className="label" htmlFor="type">Type</label>
            <input className="input" name="type" />
          </div>
          <div>
            <label className="label" htmlFor="brand">Brand</label>
            <input className="input" name="brand" />
          </div>
          <div>
            <label className="label" htmlFor="model">Model</label>
            <input className="input" name="model" />
          </div>
          <div>
            <label className="label" htmlFor="serial_number">Serial number</label>
            <input className="input" name="serial_number" />
          </div>
          <div>
            <label className="label" htmlFor="inventory_number">Inventory number</label>
            <input className="input" name="inventory_number" />
          </div>
          <div>
            <label className="label" htmlFor="current_location_id">Location</label>
            <select className="input" name="current_location_id">
              <option value="">Select</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select className="input" name="status" defaultValue="InStock">
              <option value="InStock">In stock</option>
              <option value="Issued">Issued</option>
              <option value="Maintenance">Maintenance</option>
              <option value="WrittenOff">Written off</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="photo_url">Photo URL</label>
            <input className="input" name="photo_url" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="notes">Notes</label>
            <textarea className="input min-h-[100px]" name="notes" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn btn-primary" type="submit">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
