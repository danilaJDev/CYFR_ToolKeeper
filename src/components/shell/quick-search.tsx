"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {createClient} from "@/lib/supabase/client";
import {cn} from "@/lib/utils";

export function QuickSearch() {
    const supabase = useMemo(() => createClient(), []);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ id: string; name: string; status: string | null; location_name: string | null }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            const {data} = await supabase
                .from("assets")
                .select("id,name,status,location_name")
                .ilike("name", `%${query.trim()}%`)
                .limit(5);
            setResults(data ?? []);
            setLoading(false);
        }, 300);

        return () => clearTimeout(handler);
    }, [query, supabase]);

    return (
        <div className="relative max-w-md">
            <input
                className="pl-10 pr-3 h-10 w-full rounded-lg border border-primary/20 bg-white/70 text-sm shadow-inner outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Быстрый поиск по инвентарю"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Поиск"
            />
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">⌘K</div>

            {query && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-primary/10 bg-white/95 shadow-lg backdrop-blur">
                    {loading ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Ищем…</div>
                    ) : results.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Нет совпадений</div>
                    ) : (
                        <ul className="divide-y divide-primary/10">
                            {results.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/assets?focus=${item.id}`}
                                        className="flex items-center justify-between px-3 py-2 text-sm hover:bg-primary/5"
                                        onClick={() => setQuery("")}
                                    >
                                        <div>
                                            <div className="font-medium text-foreground">{item.name}</div>
                                            <p className="text-xs text-muted-foreground">{item.location_name ?? "Локация не указана"}</p>
                                        </div>
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-1 text-[11px] font-semibold",
                                                item.status === "В работе"
                                                    ? "bg-primary/15 text-primary"
                                                    : item.status === "На сервисе"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-emerald-100 text-emerald-800"
                                            )}
                                        >
                                            {item.status ?? "Без статуса"}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
