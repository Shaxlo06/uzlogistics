"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { KPI_CONFIG } from "@/lib/kpi";

export function KpiCard({
  metricType,
  currentValue,
  unit,
  sparkline,
}: {
  metricType: string;
  currentValue: number;
  unit: string;
  sparkline: { value: number }[];
}) {
  const { t } = useLocale();
  const config = KPI_CONFIG[metricType];
  if (!config) return null;

  const isGood = config.goodWhenNegative ? currentValue < 0 : currentValue > 0;
  const DeltaIcon = currentValue < 0 ? ArrowDown : ArrowUp;
  const deltaColorClass = isGood ? "text-brand-green" : "text-brand-red";
  const displayValue = unit === "x" ? `${currentValue.toFixed(1)}x` : `${currentValue > 0 ? "+" : ""}${currentValue.toFixed(1)}%`;

  return (
    <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-muted">{t(config.titleKey)}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold" style={{ color: config.color }}>
          {displayValue}
        </span>
        <DeltaIcon className={`h-4 w-4 ${deltaColorClass}`} />
      </div>
      <div className="mt-2 h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <defs>
              <linearGradient id={`spark-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              fill={`url(#spark-${metricType})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[10px] text-muted">{t("kpi.last30days")}</p>
    </div>
  );
}
