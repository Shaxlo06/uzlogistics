import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CompanyFilters } from "@/components/companies/CompanyFilters";
import { CompanyCard } from "@/components/companies/CompanyCard";

export const metadata = { title: "Kompaniyalar katalogi — uzlogisticsnet" };

const PAGE_SIZE = 24;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; service?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  const where = {
    ...(params.region ? { region: params.region } : {}),
    ...(params.q ? { name: { contains: params.q } } : {}),
    ...(params.service ? { services: { some: { service: { name: params.service } } } } : {}),
  };

  const [companies, total, services] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { services: { include: { service: true } } },
      orderBy: { likesCount: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.company.count({ where }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
        Logistika kompaniyalari katalogi
      </h1>
      <p className="mt-2 text-muted">goldenpages.uz manbasidan yig&apos;ilgan, tekshirilgan kompaniyalar ro&apos;yxati — jami {total} ta</p>

      <div className="mt-6">
        <CompanyFilters services={services} />
      </div>

      {companies.length === 0 ? (
        <p className="mt-16 text-center text-muted">Hech qanday kompaniya topilmadi</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const sp = new URLSearchParams();
            if (params.region) sp.set("region", params.region);
            if (params.service) sp.set("service", params.service);
            if (params.q) sp.set("q", params.q);
            sp.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/companies?${sp.toString()}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                  p === page ? "bg-brand-blue text-white" : "border border-[var(--border-hairline)] text-muted hover:text-brand-blue"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
