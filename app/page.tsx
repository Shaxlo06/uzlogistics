import { prisma } from "@/lib/prisma";
import { REGIONS } from "@/lib/regions";
import { HomeView } from "@/components/home/HomeView";
import seedData from "@/data/companies_seed.json";

export default async function Home() {
  let companyCount: number;
  let regionCount: number;

  try {
    const [count, regionsWithCompanies] = await Promise.all([
      prisma.company.count(),
      prisma.company.findMany({ select: { region: true }, distinct: ["region"] }),
    ]);
    companyCount = count;
    regionCount = regionsWithCompanies.length;
  } catch (error) {
    console.error("Database unavailable; rendering homepage from seed data", error);
    companyCount = seedData.companies.length;
    regionCount = new Set(seedData.companies.map((company) => company.region)).size;
  }

  return (
    <HomeView
      companyCount={companyCount}
      regionCount={Math.max(regionCount, 1)}
      totalRegions={REGIONS.length}
    />
  );
}
