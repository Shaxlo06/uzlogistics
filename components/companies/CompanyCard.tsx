import Link from "next/link";
import { Heart, MapPin, Clock } from "lucide-react";

type CardCompany = {
  slug: string;
  name: string;
  region: string;
  district: string | null;
  likesCount: number;
  yearsOnSite: number | null;
  workMode: string | null;
  services: { service: { name: string } }[];
};

export function CompanyCard({ company }: { company: CardCompany }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="flex flex-col rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-foreground">{company.name}</h3>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
          <Heart className="h-3.5 w-3.5 text-brand-red" /> {company.likesCount}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted">
        <MapPin className="h-3.5 w-3.5" /> {company.region}
        {company.district ? `, ${company.district}` : ""}
      </p>
      {company.workMode && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" /> {company.workMode}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.services.slice(0, 3).map((cs) => (
          <span
            key={cs.service.name}
            className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue"
          >
            {cs.service.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
