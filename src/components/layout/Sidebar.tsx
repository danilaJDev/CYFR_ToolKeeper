"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Home, MapPin, Settings, Split, Wrench } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/assets", label: "Assets", icon: Wrench },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/transfers", label: "Transfers", icon: Split },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden min-h-screen w-60 flex-shrink-0 flex-col rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 shadow-xl shadow-black/40 backdrop-blur lg:flex">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold text-emerald-300">
        <Boxes className="h-5 w-5" /> ToolKeeper
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-800/60",
                active ? "bg-slate-800/80 text-emerald-300" : "text-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="rounded-lg border border-slate-800/60 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
        Multi-organization tool tracking with audit-ready history.
      </div>
    </aside>
  );
}
