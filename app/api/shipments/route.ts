import { NextResponse } from "next/server";
import { ensureSimulationRunning, getShipmentSnapshot, getRegionFlow } from "@/lib/simulation";

export async function GET() {
  ensureSimulationRunning();
  const [shipments, regionFlow] = await Promise.all([getShipmentSnapshot(), getRegionFlow()]);
  return NextResponse.json({ shipments, regionFlow });
}
