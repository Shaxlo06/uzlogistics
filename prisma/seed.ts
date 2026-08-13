import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import seedData from "../data/companies_seed.json";
import { computeOfficialForecast } from "../lib/forecast";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const SERVICE_TRANSLATIONS: Record<string, { ru: string; en: string }> = {
  "Logistika": { ru: "Логистика", en: "Logistics" },
  "Konteyner tashish": { ru: "Контейнерные перевозки", en: "Container transport" },
  "Ekspeditorlik": { ru: "Экспедирование", en: "Forwarding" },
  "Havo yuk tashish": { ru: "Авиаперевозки", en: "Air freight" },
  "Dengiz tashish": { ru: "Морские перевозки", en: "Sea freight" },
  "Avto yuk tashish": { ru: "Автоперевозки", en: "Road freight" },
  "Bojxona omborxonasi": { ru: "Таможенный склад", en: "Customs warehouse" },
  "Yuklash-tushirish ishlari": { ru: "Погрузо-разгрузочные работы", en: "Loading & unloading" },
  "Transport kompaniyasi": { ru: "Транспортная компания", en: "Transport company" },
  "Xalqaro yuk tashish": { ru: "Международные перевозки", en: "International freight" },
  "Kuryerlik xizmatlari": { ru: "Курьерские услуги", en: "Courier services" },
};

const CARGO_TYPES = ["Elektronika", "Tekstil", "Qurilish materiallari", "Oziq-ovqat", "Avtomobil qismlari", "Kimyoviy mahsulotlar"];
const STATUSES = ["in_transit", "customs", "delivered", "delayed"];

// Approximate points along the China -> Kazakhstan -> Uzbekistan -> Turkmenistan/Afghanistan -> transit corridor.
const CORRIDOR_REGIONS = [
  "Toshkent",
  "Sirdaryo viloyati",
  "Samarqand viloyati",
  "Jizzax viloyati",
  "Qashqadaryo viloyati",
  "Buxoro viloyati",
  "Navoiy viloyati",
  "Xorazm viloyati",
  "Farg'ona viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Surxondaryo viloyati",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function main() {
  console.log("Seeding services...");
  const serviceIdByName = new Map<string, string>();
  const allServiceNames = new Set<string>();
  for (const c of seedData.companies) {
    for (const s of c.services) allServiceNames.add(s);
  }
  for (const name of allServiceNames) {
    const t = SERVICE_TRANSLATIONS[name];
    const service = await prisma.service.upsert({
      where: { name },
      update: { nameRu: t?.ru, nameEn: t?.en },
      create: { name, nameRu: t?.ru, nameEn: t?.en },
    });
    serviceIdByName.set(name, service.id);
  }

  console.log("Seeding companies...");
  for (const c of seedData.companies) {
    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        legalName: c.legalName,
        region: c.region,
        district: c.district,
        address: c.address,
        phonePrefix: c.phonePrefix,
        phoneFull: c.phoneFull,
        description: c.description,
        latitude: c.latitude,
        longitude: c.longitude,
        yearsOnSite: c.yearsOnSite,
        likesCount: c.likesCount,
        workMode: c.workMode,
        isProducer: c.isProducer,
        isExporter: c.isExporter,
        sourceUrl: c.sourceUrl,
        sourceId: c.sourceId,
      },
      create: {
        name: c.name,
        legalName: c.legalName,
        slug: c.slug,
        region: c.region,
        district: c.district,
        address: c.address,
        phonePrefix: c.phonePrefix,
        phoneFull: c.phoneFull,
        description: c.description,
        latitude: c.latitude,
        longitude: c.longitude,
        yearsOnSite: c.yearsOnSite,
        likesCount: c.likesCount,
        workMode: c.workMode,
        isProducer: c.isProducer,
        isExporter: c.isExporter,
        sourceUrl: c.sourceUrl,
        sourceId: c.sourceId,
      },
    });

    for (const serviceName of c.services) {
      const serviceId = serviceIdByName.get(serviceName)!;
      await prisma.companyService.upsert({
        where: { companyId_serviceId: { companyId: company.id, serviceId } },
        update: {},
        create: { companyId: company.id, serviceId },
      });
    }
  }

  console.log("Seeding sample shipments...");
  const companies = await prisma.company.findMany({ select: { id: true, region: true } });
  const rnd = mulberry32(42);
  const existingShipments = await prisma.shipment.count();
  if (existingShipments === 0 && companies.length > 0) {
    for (let i = 0; i < 24; i++) {
      const seed = rnd();
      const company = pick(companies, seed);
      const origin = pick(CORRIDOR_REGIONS, rnd());
      let dest = pick(CORRIDOR_REGIONS, rnd());
      if (dest === origin) dest = CORRIDOR_REGIONS[(CORRIDOR_REGIONS.indexOf(origin) + 3) % CORRIDOR_REGIONS.length];
      const status = pick(STATUSES, rnd());
      const progressPct = status === "delivered" ? 100 : Math.floor(rnd() * 90) + 5;
      await prisma.shipment.create({
        data: {
          companyId: company.id,
          originRegion: origin,
          destRegion: dest,
          cargoType: pick(CARGO_TYPES, rnd()),
          status,
          progressPct,
          etaHours: status === "delivered" ? 0 : Math.floor(rnd() * 72) + 1,
          currentLat: 40 + rnd() * 3,
          currentLng: 63 + rnd() * 9,
          costUsd: Math.round((500 + rnd() * 9500) * 100) / 100,
        },
      });
    }
  }

  console.log("Seeding 30-day KPI history...");
  const metricExisting = await prisma.realtimeMetric.count();
  if (metricExisting === 0) {
    const targets: Record<string, { start: number; end: number; unit: string }> = {
      logistics_cost_index: { start: 0, end: -8.4, unit: "%" },
      delivery_speed: { start: 0, end: 12.1, unit: "%" },
      transit_efficiency: { start: 0, end: 15.3, unit: "%" },
      processing_speed: { start: 1, end: 2.3, unit: "x" },
      monitoring_accuracy: { start: 1, end: 2.8, unit: "x" },
    };
    const now = Date.now();
    for (const [metricType, { start, end, unit }] of Object.entries(targets)) {
      for (let day = 29; day >= 0; day--) {
        const progress = (29 - day) / 29;
        const noise = (mulberry32(day * 7 + metricType.length)() - 0.5) * Math.abs(end - start) * 0.08;
        const value = start + (end - start) * progress + noise;
        await prisma.realtimeMetric.create({
          data: {
            metricType,
            value: Math.round(value * 100) / 100,
            unit,
            recordedAt: new Date(now - day * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  // Two independent forecast series, never mixed together:
  //  - "official_transport_h": REAL 2014-2026 history from the Milliy
  //    statistika qo'mitasi (data/official_stats_transport_h.json), the
  //    entire republic's "H - Tashish va saqlash" sector (23,935 korxona in
  //    2026) -- not the 242-company goldenpages.uz catalogue. 2027-2030 is a
  //    conservative extrapolation (see lib/forecast.ts).
  //  - "logistics_efficiency_index": a synthetic 0-100 illustrative index
  //    modelling the combined effect of the LX/YT/TS and 2.3x/2.8x findings
  //    (ilmiy yangilik 2-3), explicitly labelled as modelled, not measured.
  console.log("Seeding official transport-sector forecast points (2014-2030)...");
  await prisma.forecastPoint.deleteMany({ where: { metricType: "official_transport_h" } });
  const { rows: officialRows } = computeOfficialForecast();
  for (const row of officialRows) {
    await prisma.forecastPoint.create({
      data: { ...row, metricType: "official_transport_h" },
    });
  }

  console.log("Seeding synthetic logistics-efficiency-index forecast points (2020-2030)...");
  await prisma.forecastPoint.deleteMany({ where: { metricType: "logistics_efficiency_index" } });
  const historical: Record<number, number> = {
    2020: 41,
    2021: 44,
    2022: 48,
    2023: 53,
    2024: 58,
    2025: 63,
  };
  const forecast: Record<number, [number, number, number]> = {
    2025: [63, 60, 66],
    2026: [69, 64, 74],
    2027: [75, 68, 82],
    2028: [81, 71, 91],
    2029: [87, 74, 100],
    2030: [93, 77, 109],
  };
  for (let year = 2020; year <= 2030; year++) {
    const hist = historical[year] ?? null;
    const fc = forecast[year];
    await prisma.forecastPoint.create({
      data: {
        year,
        metricType: "logistics_efficiency_index",
        historicalValue: hist,
        forecastValue: fc ? fc[0] : null,
        lowerBound: fc ? fc[1] : null,
        upperBound: fc ? fc[2] : null,
      },
    });
  }

  console.log("Seeding admin user...");
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: { username: adminUsername, passwordHash },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
