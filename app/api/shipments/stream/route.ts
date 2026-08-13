import { NextRequest } from "next/server";
import { ensureSimulationRunning, getShipmentSnapshot, getRegionFlow } from "@/lib/simulation";

export const dynamic = "force-dynamic";

const PUSH_INTERVAL_MS = 3000;

export async function GET(request: NextRequest) {
  ensureSimulationRunning();

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const push = async () => {
        try {
          const [shipments, regionFlow] = await Promise.all([getShipmentSnapshot(), getRegionFlow()]);
          const payload = JSON.stringify({ shipments, regionFlow, ts: Date.now() });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch (err) {
          console.error("[sse] push failed", err);
        }
      };

      push();
      timer = setInterval(push, PUSH_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        if (timer) clearInterval(timer);
        controller.close();
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
