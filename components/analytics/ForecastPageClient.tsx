"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ForecastChart } from "@/components/analytics/ForecastChart";

const formatThousands = (v: number) => v.toLocaleString("en-US");

export function ForecastPageClient() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
        {t("forecast.title")}
      </h1>
      <p className="mt-2 text-muted">{t("forecast.subtitle")}</p>

      {/* Primary chart — real official statistics, never mixed with the
          goldenpages.uz company catalogue count. */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">{t("forecast.officialTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("forecast.officialSubtitle")}</p>
        <div className="mt-3">
          <ForecastChart metricType="official_transport_h" yDomain={[0, 32000]} valueFormatter={formatThousands} />
        </div>
        <p className="mt-2 text-xs text-muted">{t("forecast.officialSource")}</p>
        <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-foreground/80">
          {t("forecast.distinctionNote")}
        </div>
      </section>

      {/* Secondary chart — explicitly labelled synthetic/modelled index. */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground">{t("forecast.syntheticTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("forecast.syntheticSubtitle")}</p>
        <div className="mt-3">
          <ForecastChart metricType="logistics_efficiency_index" yDomain={[0, 110]} lineColor="#0b2545" />
        </div>
        <p className="mt-2 text-xs italic text-muted">{t("forecast.syntheticNote")}</p>
      </section>

      <div className="mt-8 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
        <h2 className="mb-2 text-sm font-bold text-foreground">{t("forecast.methodology")}</h2>
        <p className="text-sm text-muted">{t("forecast.methodologyText")}</p>
      </div>
    </div>
  );
}
