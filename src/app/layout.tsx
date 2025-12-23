import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKeeper",
  description: "Multi-tenant tool tracking with Supabase + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 lg:px-8">{children}</div>
      </body>
    </html>
  );
}
