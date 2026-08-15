import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminCompaniesClient } from "@/components/admin/AdminCompaniesClient";

export const metadata = { title: "Admin: kompaniyalar — uzlogisticsnet" };

export default async function AdminCompaniesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      legalName: true,
      region: true,
      district: true,
      address: true,
      phonePrefix: true,
      description: true,
      website: true,
      workMode: true,
      likesCount: true,
      isProducer: true,
      isExporter: true,
    },
  });

  return <AdminCompaniesClient initialCompanies={companies} username={session.username} />;
}
