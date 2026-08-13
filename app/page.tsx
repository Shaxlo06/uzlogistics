import { prisma } from "@/lib/prisma";
import { REGIONS } from "@/lib/regions";
import { HomeView } from "@/components/home/HomeView";

export default async function Home() {
  const [companyCount, regionsWithCompanies] = await Promise.all([
    prisma.company.count(),
    prisma.company.findMany({ select: { region: true }, distinct: ["region"] }),
  ]);

  return (
    <HomeView
      companyCount={companyCount}
      regionCount={Math.max(regionsWithCompanies.length, 1)}
      totalRegions={REGIONS.length}
    />
  );
}
