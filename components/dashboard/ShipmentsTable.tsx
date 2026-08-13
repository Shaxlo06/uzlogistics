"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { STATUS_COLORS, STATUS_LABEL_KEY } from "@/lib/status";
import type { ShipmentSnapshot } from "@/lib/useShipmentStream";

export function ShipmentsTable({ shipments }: { shipments: ShipmentSnapshot[] }) {
  const { t } = useLocale();

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)]">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] text-left text-xs text-muted">
            <th className="px-4 py-3 font-medium">{t("dashboard.company")}</th>
            <th className="px-4 py-3 font-medium">{t("dashboard.route")}</th>
            <th className="px-4 py-3 font-medium">{t("dashboard.status")}</th>
            <th className="px-4 py-3 font-medium">{t("dashboard.progress")}</th>
            <th className="px-4 py-3 font-medium">{t("dashboard.eta")}</th>
          </tr>
        </thead>
        <tbody>
          {shipments.slice(0, 15).map((s) => (
            <tr key={s.id} className="border-b border-[var(--border-hairline)] last:border-0">
              <td className="px-4 py-3 font-medium">{s.companyName}</td>
              <td className="px-4 py-3 text-muted">
                {s.originRegion} → {s.destRegion}
              </td>
              <td className="px-4 py-3">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${STATUS_COLORS[s.status]}1a`, color: STATUS_COLORS[s.status] }}
                >
                  {t(STATUS_LABEL_KEY[s.status] ?? "dashboard.statusInTransit")}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.progressPct}%`, backgroundColor: STATUS_COLORS[s.status] }}
                    />
                  </div>
                  <span className="text-xs text-muted">{s.progressPct}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">{s.etaHours ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
