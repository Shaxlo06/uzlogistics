import { prisma } from "@/lib/prisma";
import { MapPageClient } from "@/components/map/MapPageClient";

export const metadata = { title: "Xarita — uzlogisticsnet" };

export default async function MapPage() {
  const companies = await prisma.company.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: { id: true, name: true, slug: true, latitude: true, longitude: true },
  });

  const points = companies
    .filter((c) => c.latitude != null && c.longitude != null)
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, lat: c.latitude as number, lng: c.longitude as number }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
        O&apos;zbekiston logistika xaritasi
      </h1>
      <p className="mt-2 text-muted">
        Barcha ro&apos;yxatdan o&apos;tgan kompaniyalar va simulyatsiya qilingan faol yuklar bir xaritada.
      </p>
      <div className="mt-6">
        <MapPageClient companies={points} />
      </div>
    </div>
  );
}
