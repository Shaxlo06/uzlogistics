"use client";

import { useEffect, useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type ForecastPoint = {
  year: number;
  historicalValue: number | null;
  forecastValue: number | null;
  lowerBound: number | null;
  upperBound: number | null;
};

export function ForecastChart({
  metricType,
  yDomain,
  valueFormatter,
  lineColor = "#0b2545",
}: {
  /** Which ForecastPoint.metricType series to fetch from /api/forecast. */
  metricType: "official_transport_h" | "logistics_efficiency_index";
  /** Recharts YAxis domain, tuned per series scale. */
  yDomain: [number, number];
  /** Formats raw numbers for axis ticks / tooltip (e.g. thousands separators). */
  valueFormatter?: (v: number) => string;
  /** Color for the solid "historical" line (forecast line is always purple). */
  lineColor?: string;
}) {
  const { t } = useLocale();
  const [points, setPoints] = useState<ForecastPoint[]>([]);

  useEffect(() => {
    fetch(`/api/forecast?metric=${metricType}`)
      .then((r) => r.json())
      .then((d) => setPoints(d.points ?? []))
      .catch((err) => console.error("[forecast] failed to load", err));
  }, [metricType]);

  const data = points.map((p) => ({
    year: p.year,
    [t("forecast.historical")]: p.historicalValue,
    [t("forecast.forecastLine")]: p.forecastValue,
    lowerBound: p.lowerBound,
    bandwidth: p.upperBound !== null && p.lowerBound !== null ? p.upperBound - p.lowerBound : null,
  }));

  const historicalKey = t("forecast.historical");
  const forecastKey = t("forecast.forecastLine");
  const format = valueFormatter ?? ((v: number) => `${v}`);

  return (
    <div className="h-[420px] w-full rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={format}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border-hairline)" }}
            formatter={(value) => (typeof value === "number" ? format(value) : value)}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area dataKey="lowerBound" stackId="ci" stroke="none" fill="none" legendType="none" isAnimationActive={false} />
          <Area
            dataKey="bandwidth"
            stackId="ci"
            name={t("forecast.confidenceInterval")}
            stroke="none"
            fill="#8b5cf6"
            fillOpacity={0.15}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey={historicalKey}
            stroke={lineColor}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey={forecastKey}
            stroke="#8b5cf6"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 3 }}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
