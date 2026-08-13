"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { RegionFlowEntry } from "@/lib/useShipmentStream";

export function RegionFlowChart({ data }: { data: RegionFlowEntry[] }) {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-4">
      <h3 className="mb-4 text-sm font-bold text-foreground">{t("dashboard.regionFlow")}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="var(--border-hairline)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="route"
              width={170}
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(59,130,246,0.08)" }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border-hairline)" }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
