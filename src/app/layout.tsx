import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "Toolkeeper",
  description: "Инструменты и материалы под контролем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
