import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string }) {
  return (
    <div className="flex gap-6">
      <Sidebar />
      <main className="flex-1">
        <Topbar userEmail={userEmail} />
        {children}
      </main>
    </div>
  );
}
