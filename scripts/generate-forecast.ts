// Regenerates the 2027-2030 forecast points for the "H — Tashish va saqlash"
// official enterprise-count series and prints them (also usable as a
// `> data/forecast_generated.json` redirect for inspection). The same
// computation is used directly by `prisma/seed.ts` — this script exists so
// the extrapolation can be reviewed/regenerated independently of a DB seed.
//
// Usage: npx tsx scripts/generate-forecast.ts

import { computeOfficialForecast, OFFICIAL_STATS_META } from "../lib/forecast";

function main() {
  const { rows, avgGrowthRate } = computeOfficialForecast();

  console.log(`Source: ${OFFICIAL_STATS_META.source}`);
  console.log(`Indicator: ${OFFICIAL_STATS_META.indicatorUz} (${OFFICIAL_STATS_META.indicatorCode})`);
  console.log(`Conservative growth rate used for 2027-2030 (avg YoY of 2024-2026): ${(avgGrowthRate * 100).toFixed(2)}%`);
  console.log();
  console.table(
    rows.map((r) => ({
      year: r.year,
      historical: r.historicalValue ?? "",
      forecast: r.forecastValue ?? "",
      lowerBound: r.lowerBound ?? "",
      upperBound: r.upperBound ?? "",
    }))
  );

  console.log(JSON.stringify(rows, null, 2));
}

main();
