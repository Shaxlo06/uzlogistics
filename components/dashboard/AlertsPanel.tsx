"use client";

import { AlertTriangle, BellOff, WifiOff } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { ShipmentSnapshot } from "@/lib/useShipmentStream";

export function AlertsPanel({ shipments, connected }: { shipments: ShipmentSnapshot[]; connected: boolean }) {
  const { t } = useLocale();
  const delayed = shipments.filter((s) => s.status === "delayed");

  const hasAlerts = delayed.length > 0 || !connected;

  return (
    <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
        <AlertTriangle className="h-4 w-4 text-brand-red" /> {t("dashboard.alerts")}
      </h3>

      {!hasAlerts && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <BellOff className="h-4 w-4" /> {t("dashboard.noAlerts")}
        </p>
      )}

      <ul className="space-y-2">
        {!connected && (
          <li className="flex items-center gap-2 rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
            <WifiOff className="h-4 w-4 shrink-0" /> {t("dashboard.connectionOffline")}
          </li>
        )}
        {delayed.slice(0, 5).map((s) => (
          <li key={s.id} className="flex items-center gap-2 rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              {s.companyName}: {s.originRegion} → {s.destRegion} — {t("dashboard.statusDelayed")} (ETA {s.etaHours}h)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
