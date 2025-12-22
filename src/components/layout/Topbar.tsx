"use client";

import { Menu, LogOut, User } from "lucide-react";
import * as Sheet from "@radix-ui/react-sheet";
import { logout } from "@/app/actions/auth";
import { Sidebar } from "./Sidebar";

export function Topbar({ userEmail }: { userEmail?: string }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <Sheet.Root>
        <Sheet.Trigger className="inline-flex rounded-lg border border-slate-800/60 bg-slate-900/70 p-2 lg:hidden">
          <Menu className="h-5 w-5" />
        </Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out" />
          <Sheet.Content className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 p-4 shadow-xl shadow-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out">
            <Sidebar />
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 shadow-inner shadow-black/30">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">ToolKeeper</p>
          <p className="text-sm font-semibold text-emerald-200">Multi-tenant inventory control</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
        <User className="h-4 w-4" />
        <span>{userEmail ?? ""}</span>
        <form action={logout} className="ml-2">
          <button className="rounded-lg border border-slate-800/60 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-slate-700">
            <div className="flex items-center gap-1"><LogOut className="h-3 w-3" /> Logout</div>
          </button>
        </form>
      </div>
    </header>
  );
}
