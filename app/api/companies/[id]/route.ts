import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: { services: { include: { service: true } } },
  });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ company });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const {
    name,
    legalName,
    region,
    district,
    address,
    phonePrefix,
    description,
    website,
    workMode,
    likesCount,
    isProducer,
    isExporter,
  } = body;

  const company = await prisma.company.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(legalName !== undefined ? { legalName } : {}),
      ...(region !== undefined ? { region } : {}),
      ...(district !== undefined ? { district } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(phonePrefix !== undefined ? { phonePrefix } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(website !== undefined ? { website } : {}),
      ...(workMode !== undefined ? { workMode } : {}),
      ...(likesCount !== undefined ? { likesCount } : {}),
      ...(isProducer !== undefined ? { isProducer } : {}),
      ...(isExporter !== undefined ? { isExporter } : {}),
    },
  });

  return NextResponse.json({ company });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
