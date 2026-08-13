import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const region = searchParams.get("region") || undefined;
  const service = searchParams.get("service") || undefined;
  const q = searchParams.get("q") || undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "24")));

  const where = {
    ...(region ? { region } : {}),
    ...(q ? { name: { contains: q } } : {}),
    ...(service
      ? { services: { some: { service: { name: service } } } }
      : {}),
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { services: { include: { service: true } } },
      orderBy: { likesCount: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.company.count({ where }),
  ]);

  return NextResponse.json({
    companies,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

const createCompanySchema = z.object({
  name: z.string().min(1),
  legalName: z.string().optional(),
  region: z.string().min(1),
  district: z.string().optional(),
  address: z.string().optional(),
  phonePrefix: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  workMode: z.string().optional(),
});

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/["'()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `company-${Date.now()}`
  );
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createCompanySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let i = 2;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i++;
  }

  const company = await prisma.company.create({
    data: { ...parsed.data, slug },
  });

  return NextResponse.json({ company }, { status: 201 });
}
