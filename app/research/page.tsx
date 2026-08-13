import Link from "next/link";
import { ArrowRight, Cpu, Database, Radio, TrendingUp } from "lucide-react";

const DISCOVERIES = [
  {
    icon: Cpu,
    color: "#3b82f6",
    href: "/research/digital-transformation",
    shortTitle: "Raqamli transformatsiya",
    fullTitle: "Raqamli transformatsiya tushunchasining iqtisodiy mazmunini takomillashtirish",
    desc: "Transport-logistika jarayonlariga raqamli texnologiyalar integratsiyasi orqali samaradorlikni oshirish uslubiyoti.",
  },
  {
    icon: Database,
    color: "#10b981",
    href: "/research/big-data-model",
    shortTitle: "Boshqaruv modeli",
    fullTitle: "Big Data va real vaqt monitoringga asoslangan boshqaruv modeli (LX/YT/TS)",
    desc: "Logistika xarajatlari -8-10%, yetkazib berish tezligi +12%, tranzit samaradorligi +15%.",
  },
  {
    icon: Radio,
    color: "#f59e0b",
    href: "/research/realtime-monitoring",
    shortTitle: "Real vaqt monitoring",
    fullTitle: "Raqamli platforma asosidagi real vaqt monitoring modeli (2.3x / 2.8x)",
    desc: "Ma'lumotlarni qayta ishlash tezligi 2.3 barobar, monitoring aniqligi 2.8 barobar oshadi.",
  },
  {
    icon: TrendingUp,
    color: "#8b5cf6",
    href: "/research/forecast-2030",
    shortTitle: "2030 prognozi",
    fullTitle: "Ekonometrik modellashtirish asosidagi 2030-yilgacha prognoz",
    desc: "Ekonometrik modellashtirish asosida logistika samaradorligi trendining prognozi.",
  },
];

export default function ResearchIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">Ilmiy-amaliy tadqiqot</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-4xl">
        Ilmiy natijalar
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        O&apos;zbekistonda logistika tizimlarini raqamli transformatsiyalash usullarini takomillashtirish va real
        vaqt monitoring tizimini ishlab chiqish bo&apos;yicha dissertatsiya tadqiqotining asosiy ilmiy natijalari.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {DISCOVERIES.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex flex-col rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${d.color}1a`, color: d.color }}
            >
              <d.icon className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">{d.shortTitle}</h2>
            <p className="mt-1 text-xs italic text-muted">{d.fullTitle}</p>
            <p className="mt-2 flex-1 text-sm text-muted">{d.desc}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-blue">
              Batafsil <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
