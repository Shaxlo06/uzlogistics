"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { REGIONS } from "@/lib/regions";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function CompanyFilters({ services }: { services: { name: string; nameRu: string | null }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { t } = useLocale();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder={t("companies.searchPlaceholder")}
          onChange={(e) => update("q", e.target.value)}
          className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-blue"
        />
      </div>
      <select
        defaultValue={searchParams.get("region") ?? ""}
        onChange={(e) => update("region", e.target.value)}
        className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
      >
        <option value="">{t("companies.allRegions")}</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get("service") ?? ""}
        onChange={(e) => update("service", e.target.value)}
        className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
      >
        <option value="">{t("companies.allServices")}</option>
        {services.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
