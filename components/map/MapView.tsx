"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] text-sm text-muted">
      Xarita yuklanmoqda...
    </div>
  ),
});

export function MapView(props: { markers: MapMarker[]; center?: [number, number]; zoom?: number; height?: number }) {
  return <LeafletMap {...props} />;
}

export type { MapMarker };
