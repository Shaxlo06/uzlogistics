import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Heart, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PhoneReveal } from "@/components/companies/PhoneReveal";
import { MapView } from "@/components/map/MapView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  return { title: company ? `${company.name} — UzLogistics` : "Kompaniya topilmadi" };
}

export default async function CompanyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { services: { include: { service: true } } },
  });

  if (!company) notFound();

  const tags = [company.isProducer ? "Ishlab chiqaruvchi" : null, company.isExporter ? "Eksportyor" : null].filter(
    Boolean,
  ) as string[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/companies" className="mb-6 flex items-center gap-1 text-sm text-muted hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" /> Katalogga qaytish
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy dark:text-white sm:text-3xl">{company.name}</h1>
          {company.legalName && <p className="mt-1 text-sm text-muted">{company.legalName}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand-red/10 px-3 py-1.5 text-sm font-semibold text-brand-red">
          <Heart className="h-4 w-4" /> {company.likesCount}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
          <p className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            <span>
              {company.region}
              {company.district ? `, ${company.district}` : ""}
              {company.address ? ` — ${company.address}` : ""}
            </span>
          </p>
          {company.workMode && (
            <p className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 shrink-0 text-brand-blue" /> Ish rejimi: {company.workMode}
            </p>
          )}
          <PhoneReveal prefix={company.phonePrefix} full={company.phoneFull} />
          {company.yearsOnSite !== null && (
            <p className="text-xs text-muted">{company.yearsOnSite} yil saytda ro&apos;yxatdan o&apos;tgan</p>
          )}
        </div>

        {company.latitude && company.longitude && (
          <MapView
            markers={[{ id: company.id, lat: company.latitude, lng: company.longitude, color: "#3b82f6", popup: company.name }]}
            center={[company.latitude, company.longitude]}
            zoom={11}
            height={220}
          />
        )}
      </div>

      {company.description && (
        <div className="mt-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
          <h2 className="mb-2 text-sm font-bold text-foreground">Tavsif</h2>
          <p className="text-sm text-muted">{company.description}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-foreground">Xizmatlar</h2>
        <div className="flex flex-wrap gap-2">
          {company.services.map((cs) => (
            <span key={cs.service.id} className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
              {cs.service.name}
            </span>
          ))}
        </div>
      </div>

      {company.sourceUrl && (
        <p className="mt-8 text-xs text-muted">
          Manba:{" "}
          <a href={company.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">
            goldenpages.uz
          </a>
        </p>
      )}
    </div>
  );
}
