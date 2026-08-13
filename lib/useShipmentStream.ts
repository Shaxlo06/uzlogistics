"use client";

import { useEffect, useRef, useState } from "react";

export type ShipmentSnapshot = {
  id: string;
  companyId: string;
  companyName: string;
  originRegion: string;
  destRegion: string;
  cargoType: string;
  status: string;
  progressPct: number;
  etaHours: number | null;
  currentLat: number | null;
  currentLng: number | null;
  costUsd: number | null;
  updatedAt: string;
};

export type RegionFlowEntry = { route: string; count: number };

export function useShipmentStream() {
  const [shipments, setShipments] = useState<ShipmentSnapshot[]>([]);
  const [regionFlow, setRegionFlow] = useState<RegionFlowEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/shipments/stream");
    sourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setShipments(data.shipments ?? []);
        setRegionFlow(data.regionFlow ?? []);
        setConnected(true);
      } catch (err) {
        console.error("[useShipmentStream] failed to parse message", err);
      }
    };

    return () => {
      source.close();
    };
  }, []);

  return { shipments, regionFlow, connected };
}
