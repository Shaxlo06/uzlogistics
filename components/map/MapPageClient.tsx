"use client";

import { useMemo } from "react";
import { MapView, type MapMarker } from "@/components/map/MapView";
import { useShipmentStream } from "@/lib/useShipmentStream";
import { STATUS_COLORS } from "@/lib/status";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type CompanyPoint = { id: string; name: string; slug: string; lat: number; lng: number };

export function MapPageClient({ companies }: { companies: CompanyPoint[] }) {
  const { shipments, connected } = useShipmentStream();
  const { t } = useLocale();

  const markers: MapMarker[] = useMemo(() => {
    const companyMarkers: MapMarker[] = companies.map((c) => ({
      id: `company-${c.id}`,
      lat: c.lat,
      lng: c.lng,
      color: "#0b2545",
      popup: c.name,
    }));

    const shipmentMarkers: MapMarker[] = shipments
      .filter((s) => s.currentLat != null && s.currentLng != null)
      .map((s) => ({
        id: `shipment-${s.id}`,
        lat: s.currentLat as number,
        lng: s.currentLng as number,
        color: STATUS_COLORS[s.status] ?? "#3b82f6",
        popup: `${s.companyName}: ${s.originRegion} -> ${s.destRegion}`,
      }));

    return [...companyMarkers, ...shipmentMarkers];
  }, [companies, shipments]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-navy" /> Kompaniyalar ({companies.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" /> Faol yuklar ({shipments.length})
          </span>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${connected ? "text-brand-green" : "text-brand-red"}`}>
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-brand-green animate-pulse" : "bg-brand-red"}`} />
          {connected ? t("dashboard.connectionLive") : t("dashboard.connectionOffline")}
        </span>
      </div>
      <MapView markers={markers} zoom={6} height={560} />
    </div>
  );
}
