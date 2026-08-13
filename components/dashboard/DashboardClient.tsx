"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useShipmentStream } from "@/lib/useShipmentStream";
import { KPI_ORDER } from "@/lib/kpi";
import { STATUS_COLORS } from "@/lib/status";
import { KpiCard } from "./KpiCard";
import { ShipmentsTable } from "./ShipmentsTable";
import { RegionFlowChart } from "./RegionFlowChart";
import { AlertsPanel } from "./AlertsPanel";
import { MapView, type MapMarker } from "@/components/map/MapView";

type MetricSummary = {
  metricType: string;
  unit: string;
  currentValue: number;
  sparkline: { value: number; recordedAt: string }[];
};

export function DashboardClient() {
  const { t } = useLocale();
  const { shipments, regionFlow, connected } = useShipmentStream();
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/metrics/summary");
        const data = await res.json();
        if (!cancelled) setMetrics(data.metrics ?? []);
      } catch (err) {
        console.error("[dashboard] failed to load metrics", err);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const markers: MapMarker[] = useMemo(
    () =>
      shipments
        .filter((s) => s.currentLat != null && s.currentLng != null)
        .map((s) => ({
          id: s.id,
          lat: s.currentLat as number,
          lng: s.currentLng as number,
          color: STATUS_COLORS[s.status] ?? "#3b82f6",
          popup: `${s.companyName}: ${s.originRegion} -> ${s.destRegion} (${s.progressPct}%)`,
        })),
    [shipments],
  );

  const metricsByType = useMemo(() => new Map(metrics.map((m) => [m.metricType, m])), [metrics]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
            {t("dashboard.title")}
          </h1>
          <p className="mt-1 text-muted">{t("dashboard.subtitle")}</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            connected ? "border-brand-green/30 text-brand-green" : "border-brand-red/30 text-brand-red"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-brand-green animate-pulse" : "bg-brand-red"}`} />
          {connected ? t("dashboard.connectionLive") : t("dashboard.connectionOffline")}
        </span>
      </div>

      <p className="mt-4 rounded-lg bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-400">
        {t("dashboard.disclaimer")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {KPI_ORDER.map((metricType) => {
          const m = metricsByType.get(metricType);
          if (!m) {
            return (
              <div
                key={metricType}
                className="h-32 animate-pulse rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)]"
              />
            );
          }
          return (
            <KpiCard
              key={metricType}
              metricType={metricType}
              currentValue={m.currentValue}
              unit={m.unit}
              sparkline={m.sparkline}
            />
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-foreground">{t("dashboard.liveMap")}</h2>
          <MapView markers={markers} height={420} />
        </div>
        <AlertsPanel shipments={shipments} connected={connected} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-foreground">{t("dashboard.activeShipments")}</h2>
          <ShipmentsTable shipments={shipments} />
        </div>
        <RegionFlowChart data={regionFlow} />
      </div>
    </div>
  );
}
