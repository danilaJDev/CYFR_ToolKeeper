"use client";

import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/routing";
import { useTransition } from "react";

const LOCALES: Locale[] = ["ru", "en"];

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(l: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: l });
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      {LOCALES.map((l) => (
        <Button
          key={l}
          type="button"
          variant={l === locale ? "default" : "ghost"}
          size="sm"
          onClick={() => onSelectChange(l)}
          disabled={isPending}
          aria-label={l === "ru" ? "Переключить на русский" : "Switch to English"}
        >
          {l.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
