import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METRIC_TYPES = [
  "logistics_cost_index",
  "delivery_speed",
  "transit_efficiency",
  "processing_speed",
  "monitoring_accuracy",
] as const;

export async function GET() {
  const results = await Promise.all(
    METRIC_TYPES.map(async (metricType) => {
      const history = await prisma.realtimeMetric.findMany({
        where: { metricType },
        orderBy: { recordedAt: "asc" },
      });
      const last = history.at(-1);
      // Tiny live jitter (not persisted) so the headline number visibly breathes between polls.
      const liveJitter = last ? (Math.random() - 0.5) * Math.abs(last.value) * 0.015 : 0;
      return {
        metricType,
        unit: last?.unit ?? "",
        currentValue: last ? Math.round((last.value + liveJitter) * 100) / 100 : 0,
        sparkline: history.map((h) => ({ value: h.value, recordedAt: h.recordedAt.toISOString() })),
      };
    }),
  );

  return NextResponse.json({ metrics: results });
}
