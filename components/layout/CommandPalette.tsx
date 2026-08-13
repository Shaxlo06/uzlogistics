"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Home, Building2, Map, LayoutDashboard, BarChart3, TrendingUp, FlaskConical } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type CompanyHit = { id: string; name: string; slug: string; region: string };

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [fetchedCompanies, setFetchedCompanies] = useState<CompanyHit[]>([]);

  // Reset the search box when the palette closes. Following React's guidance
  // for resetting state on prop change: do it during render, not in an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setSearch("");
  }

  const trimmedSearch = search.trim();
  const companies = trimmedSearch.length >= 2 ? fetchedCompanies : [];

  useEffect(() => {
    if (!open || trimmedSearch.length < 2) return;
    const handle = setTimeout(() => {
      fetch(`/api/companies?q=${encodeURIComponent(trimmedSearch)}&pageSize=6`)
        .then((r) => r.json())
        .then((d) => setFetchedCompanies(d.companies ?? []))
        .catch(() => setFetchedCompanies([]));
    }, 200);
    return () => clearTimeout(handle);
  }, [trimmedSearch, open]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  const pages = [
    { href: "/", label: t("commandPalette.home"), icon: Home, keywords: ["home", "bosh"] },
    { href: "/companies", label: t("commandPalette.companiesCatalog"), icon: Building2, keywords: ["companies", "catalog"] },
    { href: "/map", label: t("commandPalette.openMap"), icon: Map, keywords: ["map", "xarita"] },
    { href: "/dashboard", label: t("commandPalette.goDashboard"), icon: LayoutDashboard, keywords: ["dashboard", "monitoring"] },
    { href: "/analytics", label: t("commandPalette.analytics"), icon: BarChart3, keywords: ["analytics", "tahlil"] },
    { href: "/analytics/forecast", label: t("commandPalette.forecast"), icon: TrendingUp, keywords: ["forecast", "prognoz"] },
    { href: "/research", label: t("commandPalette.research"), icon: FlaskConical, keywords: ["research", "ilmiy"] },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-24 z-[100] w-[min(560px,92vw)] -translate-x-1/2"
      className="overflow-hidden rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] px-4">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <Command.Input
          autoFocus
          value={search}
          onValueChange={setSearch}
          placeholder={t("commandPalette.placeholder")}
          className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted"
        />
        <kbd className="hidden shrink-0 rounded border border-[var(--border-hairline)] px-1.5 py-0.5 text-[10px] text-muted sm:inline">
          ESC
        </kbd>
      </div>

      <Command.List className="max-h-80 overflow-y-auto p-2">
        {companies.length > 0 && (
          <Command.Group
            heading={
              <span className="block px-2 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {t("commandPalette.companies")}
              </span>
            }
            className="mb-1"
          >
            {companies.map((c) => (
              <Command.Item
                key={c.id}
                value={`company-${c.id}`}
                onSelect={() => go(`/companies/${c.slug}`)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-brand-blue/10 data-[selected=true]:text-brand-blue"
              >
                <Building2 className="h-4 w-4 shrink-0 text-brand-blue" />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="shrink-0 text-xs text-muted">{c.region}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group
          heading={
            <span className="block px-2 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {t("commandPalette.pages")}
            </span>
          }
          className="mb-1"
        >
          {pages
            .filter(
              (p) =>
                search.trim().length === 0 ||
                p.label.toLowerCase().includes(search.toLowerCase()) ||
                p.keywords.some((k) => k.includes(search.toLowerCase())),
            )
            .map((p) => (
              <Command.Item
                key={p.href}
                value={p.href}
                onSelect={() => go(p.href)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-brand-blue/10 data-[selected=true]:text-brand-blue"
              >
                <p.icon className="h-4 w-4 shrink-0 text-brand-blue" />
                {p.label}
              </Command.Item>
            ))}
        </Command.Group>

        {companies.length === 0 && search.trim().length >= 2 && (
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
            {t("commandPalette.empty")}
          </Command.Empty>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
