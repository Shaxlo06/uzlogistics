"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border-hairline)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="max-w-2xl text-sm text-muted">{t("footer.tagline")}</p>
        <p className="mt-3 max-w-2xl text-xs text-muted">
          {t("footer.source")}:{" "}
          <a
            href="https://www.goldenpages.uz/rubrics/?Id=4676"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline"
          >
            goldenpages.uz
          </a>
        </p>
        <p className="mt-1 max-w-2xl text-xs text-muted">{t("footer.disclaimer")}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-hairline)] pt-4 text-xs text-muted">
          <span>© {year} UzLogistics. {t("footer.rights")}</span>
          <Link href="/about" className="hover:text-brand-blue">
            {t("nav.about")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
