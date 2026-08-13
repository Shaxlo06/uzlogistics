import officialStats from "../data/official_stats_transport_h.json";

export type ForecastRow = {
  year: number;
  historicalValue: number | null;
  forecastValue: number | null;
  lowerBound: number | null;
  upperBound: number | null;
};

const FORECAST_YEARS = [2027, 2028, 2029, 2030];
// Confidence band widens the further out the projection goes.
const CI_BAND_BY_YEAR_OFFSET = [0.03, 0.06, 0.09, 0.12];
// How many trailing official years to average the YoY growth rate over.
const GROWTH_WINDOW_YEARS = 3;

/**
 * Extrapolates the official "H — Transport va saqlash" enterprise-count
 * series (2014-2026, O'zbekiston Milliy statistika qo'mitasi) forward to
 * 2030.
 *
 * Method: average year-over-year growth rate of the last
 * `GROWTH_WINDOW_YEARS` official data points (2024→2025→2026). This is a
 * deliberately conservative choice — it folds in the 2026 contraction
 * instead of projecting off the pre-dip 2025 peak, so the forward line does
 * not simply extend the earlier boom-era trend.
 *
 * The last historical year is duplicated onto the forecast series (with a
 * zero-width confidence band) purely so the dashed forecast line starts
 * exactly where the solid historical line ends, with no visual gap.
 */
export function computeOfficialForecast(): { rows: ForecastRow[]; avgGrowthRate: number } {
  const hist = officialStats.data as Record<string, number>;
  const years = Object.keys(hist).map(Number).sort((a, b) => a - b);
  const lastYear = years[years.length - 1];
  const baseValue = hist[String(lastYear)];

  const recentYears = years.slice(-(GROWTH_WINDOW_YEARS + 1));
  const growthRates: number[] = [];
  for (let i = 1; i < recentYears.length; i++) {
    const prev = hist[String(recentYears[i - 1])];
    const curr = hist[String(recentYears[i])];
    growthRates.push((curr - prev) / prev);
  }
  const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  const rows: ForecastRow[] = years.map((year) => ({
    year,
    historicalValue: hist[String(year)],
    forecastValue: year === lastYear ? baseValue : null,
    lowerBound: year === lastYear ? baseValue : null,
    upperBound: year === lastYear ? baseValue : null,
  }));

  let projected = baseValue;
  FORECAST_YEARS.forEach((year, idx) => {
    projected = projected * (1 + avgGrowthRate);
    const band = CI_BAND_BY_YEAR_OFFSET[idx];
    rows.push({
      year,
      historicalValue: null,
      forecastValue: Math.round(projected),
      lowerBound: Math.round(projected * (1 - band)),
      upperBound: Math.round(projected * (1 + band)),
    });
  });

  return { rows, avgGrowthRate };
}

export const OFFICIAL_STATS_META = {
  indicatorUz: officialStats.indicator_uz,
  indicatorCode: officialStats.indicator_code,
  classifier: officialStats.classifier,
  source: officialStats.source,
  note: officialStats.note,
  unit: officialStats.unit,
};
