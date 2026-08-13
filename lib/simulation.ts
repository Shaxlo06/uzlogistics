// SIMULATION ONLY: this module fakes a "live" GPS/IoT feed for the dashboard demo.
// A single in-process ticker mutates Shipment rows every few seconds so all
// connected SSE clients observe the same simulated state. A production system
// would replace this with a real telemetry ingestion pipeline.
import { prisma } from "@/lib/prisma";
import { REGION_CENTROIDS } from "@/lib/regions";

const TICK_MS = 3000;
const CARGO_TYPES = ["Elektronika", "Tekstil", "Qurilish materiallari", "Oziq-ovqat", "Avtomobil qismlari", "Kimyoviy mahsulotlar"];

const globalForSim = globalThis as unknown as { __simTimer?: ReturnType<typeof setInterval> };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function centroidFor(region: string): [number, number] {
  return REGION_CENTROIDS[region] ?? REGION_CENTROIDS["Toshkent"];
}

async function respawnShipment(companyIds: string[]) {
  const regions = Object.keys(REGION_CENTROIDS);
  const origin = regions[Math.floor(Math.random() * regions.length)];
  let dest = regions[Math.floor(Math.random() * regions.length)];
  if (dest === origin) dest = regions[(regions.indexOf(origin) + 4) % regions.length];
  const companyId = companyIds[Math.floor(Math.random() * companyIds.length)];
  const [lat, lng] = centroidFor(origin);

  await prisma.shipment.create({
    data: {
      companyId,
      originRegion: origin,
      destRegion: dest,
      cargoType: CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)],
      status: "in_transit",
      progressPct: 0,
      etaHours: Math.floor(randomBetween(12, 72)),
      currentLat: lat,
      currentLng: lng,
      costUsd: Math.round(randomBetween(500, 10000) * 100) / 100,
    },
  });
}

async function tick() {
  const shipments = await prisma.shipment.findMany();
  const companies = await prisma.company.findMany({ select: { id: true } });
  const companyIds = companies.map((c) => c.id);
  if (companyIds.length === 0) return;

  for (const shipment of shipments) {
    if (shipment.status === "delivered") {
      // Small chance to recycle a delivered shipment back into a fresh one so the board stays lively.
      if (Math.random() < 0.15) {
        await prisma.shipment.delete({ where: { id: shipment.id } });
        await respawnShipment(companyIds);
      }
      continue;
    }

    if (shipment.status === "delayed") {
      // Delayed shipments occasionally recover; otherwise ETA keeps slipping.
      if (Math.random() < 0.3) {
        await prisma.shipment.update({ where: { id: shipment.id }, data: { status: "in_transit" } });
      } else {
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: { etaHours: (shipment.etaHours ?? 0) + Math.floor(randomBetween(1, 4)) },
        });
      }
      continue;
    }

    const [oLat, oLng] = centroidFor(shipment.originRegion);
    const [dLat, dLng] = centroidFor(shipment.destRegion);

    let nextProgress = shipment.progressPct + Math.floor(randomBetween(2, 9));
    let nextStatus = shipment.status;

    if (nextProgress >= 100) {
      nextProgress = 100;
      nextStatus = "delivered";
    } else if (nextProgress > 35 && nextProgress < 55 && Math.random() < 0.12) {
      nextStatus = "customs";
    } else if (Math.random() < 0.04) {
      nextStatus = "delayed";
    } else {
      nextStatus = "in_transit";
    }

    const t = nextProgress / 100;
    const jitterLat = randomBetween(-0.15, 0.15);
    const jitterLng = randomBetween(-0.15, 0.15);

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        progressPct: nextProgress,
        status: nextStatus,
        currentLat: lerp(oLat, dLat, t) + jitterLat,
        currentLng: lerp(oLng, dLng, t) + jitterLng,
        etaHours: nextStatus === "delivered" ? 0 : Math.max(1, Math.round((shipment.etaHours ?? 24) * (1 - 1 / 20))),
      },
    });
  }

  // Keep a healthy number of active shipments on the board.
  const activeCount = shipments.filter((s) => s.status !== "delivered").length;
  if (activeCount < 15) {
    await respawnShipment(companyIds);
  }
}

export function ensureSimulationRunning() {
  if (globalForSim.__simTimer) return;
  globalForSim.__simTimer = setInterval(() => {
    tick().catch((err) => console.error("[simulation] tick failed", err));
  }, TICK_MS);
}

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

export async function getShipmentSnapshot(): Promise<ShipmentSnapshot[]> {
  const shipments = await prisma.shipment.findMany({
    include: { company: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });

  return shipments.map((s) => ({
    id: s.id,
    companyId: s.companyId,
    companyName: s.company.name,
    originRegion: s.originRegion,
    destRegion: s.destRegion,
    cargoType: s.cargoType,
    status: s.status,
    progressPct: s.progressPct,
    etaHours: s.etaHours,
    currentLat: s.currentLat,
    currentLng: s.currentLng,
    costUsd: s.costUsd,
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getRegionFlow(): Promise<{ route: string; count: number }[]> {
  const shipments = await prisma.shipment.findMany({
    select: { originRegion: true, destRegion: true },
  });
  const counts = new Map<string, number>();
  for (const s of shipments) {
    const key = `${s.originRegion} -> ${s.destRegion}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
