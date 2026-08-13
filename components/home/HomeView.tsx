"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function HomeView({
  companyCount,
  regionCount,
  totalRegions,
}: {
  companyCount: number;
  regionCount: number;
  totalRegions: number;
}) {
  const { t } = useLocale();

  const stats = [
    { value: `${companyCount}`, label: t("home.statCompanies") },
    { value: `${regionCount}/${totalRegions}`, label: t("home.statRegions") },
    { value: "2.3x", label: t("home.statSpeed") },
    { value: "2.8x", label: t("home.statAccuracy") },
  ];

  return (
    <div>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">{t("home.heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/companies"
              className="flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {t("home.ctaCompanies")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("home.ctaDashboard")}
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/15 bg-white/5 p-4">
                <dt className="text-xs text-white/60">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-brand-green sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
