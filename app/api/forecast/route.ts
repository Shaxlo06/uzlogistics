import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_METRICS = ["official_transport_h", "logistics_efficiency_index"] as const;

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("metric");
  const metricType = (ALLOWED_METRICS as readonly string[]).includes(requested ?? "")
    ? (requested as (typeof ALLOWED_METRICS)[number])
    : "official_transport_h";

  const points = await prisma.forecastPoint.findMany({
    where: { metricType },
    orderBy: { year: "asc" },
  });
  return NextResponse.json({ points, metricType });
}
