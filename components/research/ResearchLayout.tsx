import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function ResearchLayout({
  icon: Icon,
  color,
  kicker,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  color: string;
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="border-b border-[var(--border-hairline)] bg-[var(--surface)]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <Link href="/research" className="mb-6 flex items-center gap-1 text-sm text-muted hover:text-brand-blue">
            <ArrowLeft className="h-4 w-4" /> Ilmiy natijalar
          </Link>
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color }}>
            {kicker}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>
        </div>
      </section>
      <article className="prose-content mx-auto max-w-4xl px-4 py-12 sm:px-6">{children}</article>
    </div>
  );
}
