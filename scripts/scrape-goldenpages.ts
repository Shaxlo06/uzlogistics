// Optional next-stage script: crawls goldenpages.uz's "Логистические компании
// Узбекистана" rubric (https://www.goldenpages.uz/rubrics/?Id=4676, pages 1-13,
// ~242 companies) and upserts the results into the database via Prisma.
//
// This is intentionally NOT run automatically. It performs a real crawl of a
// third-party public directory, so before running it:
//   1. Re-check https://www.goldenpages.uz/robots.txt allows /rubrics/ and
//      /company/ paths for a generic user agent.
//   2. Keep the request delay below at 1-2s so the site isn't overloaded.
//   3. If robots.txt disallows crawling, use the site's own "Скачать список"
//      (export) feature instead and adapt `parseExportFile()` below.
//
// Usage: npm run scrape

import * as cheerio from "cheerio";
import { writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { prisma } from "../lib/prisma";

const BASE_URL = "https://www.goldenpages.uz/rubrics/?Id=4676";
const TOTAL_PAGES = 13;
const REQUEST_DELAY_MS = 1500;
const USER_AGENT = "UzLogistics-Research-Bot/1.0 (+https://github.com/; educational/research use)";

type ScrapedCompany = {
  name: string;
  legalName: string | null;
  region: string;
  district: string | null;
  address: string | null;
  phonePrefix: string | null;
  services: string[];
  description: string | null;
  yearsOnSite: number | null;
  likesCount: number;
  workMode: string | null;
  sourceId: string | null;
  sourceUrl: string | null;
};

async function fetchPage(page: number): Promise<string> {
  const url = `${BASE_URL}&Page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

// NOTE: goldenpages.uz's DOM structure changes over time — verify these
// selectors against the live page before relying on this script, and adjust
// them to match the current markup.
function parseCompanies(html: string): ScrapedCompany[] {
  const $ = cheerio.load(html);
  const companies: ScrapedCompany[] = [];

  $(".company-card, .rubric-item, .list-item").each((_, el) => {
    const card = $(el);
    const name = card.find(".company-name, h3, .title").first().text().trim();
    if (!name) return;

    const address = card.find(".address, .company-address").first().text().trim() || null;
    const phonePrefix = card.find(".phone, .company-phone").first().text().trim() || null;
    const description = card.find(".description, .company-desc").first().text().trim() || null;
    const services = card
      .find(".tags .tag, .services .service-tag")
      .map((__, tag) => $(tag).text().trim())
      .get()
      .filter(Boolean);
    const sourceHref = card.find("a").first().attr("href") ?? null;
    const sourceId = sourceHref?.match(/Id=(\d+)/)?.[1] ?? null;

    companies.push({
      name,
      legalName: null,
      region: "Toshkent",
      district: null,
      address,
      phonePrefix,
      services: services.length > 0 ? services : ["Logistika"],
      description,
      yearsOnSite: null,
      likesCount: 0,
      workMode: null,
      sourceId,
      sourceUrl: sourceHref ? new URL(sourceHref, BASE_URL).toString() : null,
    });
  });

  return companies;
}

function slugify(name: string, seen: Set<string>): string {
  const base = name.toLowerCase().replace(/["'()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = base || `company-${Date.now()}`;
  let i = 2;
  while (seen.has(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  seen.add(slug);
  return slug;
}

async function main() {
  console.log(`Crawling ${TOTAL_PAGES} pages from ${BASE_URL} ...`);
  const all: ScrapedCompany[] = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`  Page ${page}/${TOTAL_PAGES}`);
    const html = await fetchPage(page);
    all.push(...parseCompanies(html));
    if (page < TOTAL_PAGES) await sleep(REQUEST_DELAY_MS);
  }

  console.log(`Parsed ${all.length} companies. Writing data/companies_full.json ...`);
  writeFileSync(
    new URL("../data/companies_full.json", import.meta.url),
    JSON.stringify({ source: BASE_URL, total_found_on_source: 242, scraped_count: all.length, companies: all }, null, 2),
    "utf-8",
  );

  console.log("Upserting into database ...");
  const seenSlugs = new Set<string>();
  const existing = await prisma.company.findMany({ select: { slug: true } });
  existing.forEach((c) => seenSlugs.add(c.slug));

  for (const c of all) {
    const existingBySourceId = c.sourceId
      ? await prisma.company.findFirst({ where: { sourceId: c.sourceId } })
      : null;

    if (existingBySourceId) {
      await prisma.company.update({
        where: { id: existingBySourceId.id },
        data: { name: c.name, address: c.address, phonePrefix: c.phonePrefix, description: c.description },
      });
      continue;
    }

    const slug = slugify(c.name, seenSlugs);
    await prisma.company.create({
      data: {
        name: c.name,
        legalName: c.legalName,
        slug,
        region: c.region,
        district: c.district,
        address: c.address,
        phonePrefix: c.phonePrefix,
        description: c.description,
        yearsOnSite: c.yearsOnSite ?? 0,
        likesCount: c.likesCount,
        workMode: c.workMode,
        sourceId: c.sourceId,
        sourceUrl: c.sourceUrl,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
