"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { KPI_CONFIG, KPI_ORDER } from "@/lib/kpi";

type MetricSummary = {
  metricType: string;
  unit: string;
  currentValue: number;
  sparkline: { value: number; recordedAt: string }[];
};

export function AnalyticsClient() {
  const { t } = useLocale();
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);

  useEffect(() => {
    fetch("/api/metrics/summary")
      .then((r) => r.json())
      .then((d) => setMetrics(d.metrics ?? []))
      .catch((err) => console.error("[analytics] failed to load metrics", err));
  }, []);

  const byType = new Map(metrics.map((m) => [m.metricType, m]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
        {t("analytics.title")}
      </h1>
      <p className="mt-2 text-muted">{t("analytics.subtitle")}</p>

      <Link
        href="/analytics/forecast"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-blue"
      >
        {t("analytics.goToForecast")} <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {KPI_ORDER.map((metricType) => {
          const config = KPI_CONFIG[metricType];
          const m = byType.get(metricType);
          const data = (m?.sparkline ?? []).map((p, i) => ({ day: i + 1, value: p.value }));
          const unit = m?.unit ?? "";
          const current = m?.currentValue ?? 0;
          const display = unit === "x" ? `${current.toFixed(1)}x` : `${current > 0 ? "+" : ""}${current.toFixed(1)}%`;

          return (
            <div key={metricType} className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{t(config.titleKey)}</h3>
                <span className="text-xl font-extrabold" style={{ color: config.color }}>
                  {display}
                </span>
              </div>
              <div className="mt-3 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id={`analytics-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={config.color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border-hairline)" }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={config.color}
                      strokeWidth={2}
                      fill={`url(#analytics-${metricType})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[11px] text-muted">{t("kpi.last30days")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
