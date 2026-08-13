// Seed generator: transforms 40 sample companies (hand-collected from
// goldenpages.uz "Логистические компании Узбекистана" rubric, pages 1-2) and
// 80 deterministic demo companies into
// the normalized shape consumed by prisma/seed.ts. Run with:
//   node scripts/build-seed-data.mjs
// Output: data/companies_seed.json

import { writeFileSync } from "node:fs";

const RAW = [
  { name: "BALTCRAFT", legal_name: "BALTCRAFT CENTRAL ASIA OOO", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100142, ул. пр-д 2-й Шуртепа, 14", phone_prefix: "+998 90 374", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 7, likes: 10365 },
  { name: "PNS NETWORKS CO., LTD (vakillik)", region: "Toshkent", district: "Mirobod tumani", address: "100015, ул. Айбека, 22/С3", phone_prefix: "+998 90 167", services: ["Logistika", "Konteyner tashish", "Dengiz tashish", "Havo yuk tashish"], description: "Xalqaro yuk tashish, real vaqt kuzatuv tizimi bilan", years_on_site: 2, likes: 1240 },
  { name: "ORIENT LOGISTIK", legal_name: "ORIENT LOGISTIK OOO", region: "Toshkent", district: "Yakkasaroy tumani", address: "100070, ул. Кичик Бешагач, 20", phone_prefix: "+998 71 255", services: ["Logistika", "Ekspeditorlik", "Havo yuk tashish", "Avto yuk tashish"], years_on_site: 22, likes: 9660 },
  { name: "CARGO PRO GROUP", legal_name: "CARGO PRO GROUP OOO", region: "Toshkent", district: "Yakkasaroy tumani", address: "100025, ул. А.Каххара, 56А", phone_prefix: "+998 95 710", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 11, likes: 15798 },
  { name: "MARGO TRANS LOGISTIC", region: "Toshkent viloyati", district: "Yangiyo'l", address: "112000, ул. Ковунчи Тепа, 6А", phone_prefix: "+998 97 343", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 6, likes: 6389 },
  { name: "SAADA TRANSPORT", region: "Toshkent", district: "Yakkasaroy tumani", address: "100070, ул. Тафаккур, 43", phone_prefix: "+998 97 731", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 1, likes: 2780 },
  { name: "LOGISTIC24", region: "Toshkent", district: "Shayxontohur tumani", address: "100027, ул. Кирки, 34", phone_prefix: "+998 90 358", services: ["Logistika", "Konteyner tashish", "Bojxona omborxonasi", "Ekspeditorlik"], years_on_site: 4, likes: 7158 },
  { name: "CARGO.UZ", legal_name: "TURKSIB MAGISTRAL OOO", region: "Toshkent", district: "Chilonzor tumani", address: "100096, пр-т Бунёдкор, 1", phone_prefix: "+998 55 515", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 17, likes: 34007 },
  { name: "IRON ROAD LOGISTIC", region: "Toshkent", district: "Sergeli tumani", address: "ул. Саади, 5/2", phone_prefix: "+998 95 082", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 0, likes: 756 },
  { name: "STARWAYS LOGISTICS", region: "Toshkent", district: "Yunusobod tumani", address: "100000, пр-д Олой бозори, 60", phone_prefix: "+998 55 514", services: ["Logistika", "Konteyner tashish", "Dengiz tashish", "Ekspeditorlik"], years_on_site: 7, likes: 9117 },
  { name: "ROAD TRANS LOGISTICS", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100050, ул. Авайхон, 5", phone_prefix: "+998 95 195", services: ["Logistika", "Konteyner tashish", "Dengiz tashish", "Ekspeditorlik"], years_on_site: 12, likes: 7646 },
  { name: "CHINA CARGO LOGISTICS", legal_name: "AG AXEL OOO", region: "Toshkent", district: "Shayxontohur tumani", address: "100021, ул. Хадра, МБЦ Ташкент сити", phone_prefix: "+998 71 200", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], description: "Xitoydan yuk tashish mutaxassisi", years_on_site: 9, likes: 4616 },
  { name: "ACCESS WORLD TRANSPORT", region: "Toshkent", district: "Yunusobod tumani", address: "100017, м-в Кашгар, 18/37", phone_prefix: "+998 71 232", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 7, likes: 3326 },
  { name: "RICHES", legal_name: "bывш. XO'JAOBOD AVTOXAMROH OOO", region: "Andijon viloyati", district: "Xo'jaobod", address: "171400, ул. Навои, 111", phone_prefix: "+998 93 170", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 11, likes: 3010, work_mode: "24/7" },
  { name: "ARROW GREEN LOGISTICS (AGL)", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100142, пр-д 2-й Шуртепа, 14", phone_prefix: "+998 55 518", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 9, likes: 3003 },
  { name: "PRIME SHIPPING AND TRANSPORTATION", region: "Toshkent", district: "Yakkasaroy tumani", address: "100100, пр-д 3-й Каракум, 1", phone_prefix: "+998 97 109", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 8, likes: 2937 },
  { name: "STL SPEED-LOGISTICS", legal_name: "bывш. STL LOGISTIKS / SOYUZTRANSLINK EXPEDITION", region: "Toshkent", district: "Mirobod tumani", address: "100015, ул. Фидокор, 40/68", phone_prefix: "+998 90 999", services: ["Logistika", "Ekspeditorlik", "Havo yuk tashish", "Avto yuk tashish"], years_on_site: 21, likes: 2070, work_mode: "24/7" },
  { name: "CARGOLINE LOGIST GROUP", region: "Toshkent", district: "Chilonzor tumani", address: "100096, ул. Мукими, 178", phone_prefix: "+998 87 799", services: ["Logistika", "Ekspeditorlik", "Havo yuk tashish", "Avto yuk tashish"], years_on_site: 0, likes: 1864 },
  { name: "EUROIMPEX TRANS", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100000, м-в Буюк Ипак Йули, 45А", phone_prefix: "+998 97 768", services: ["Logistika", "Yuklash-tushirish ishlari", "Bojxona omborxonasi", "Ekspeditorlik"], years_on_site: 10, likes: 1664 },
  { name: "CEVA LOGISTICS TASHKENT", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100000, пр-т Мустакиллик, 88А", phone_prefix: "+998 78 140", services: ["Logistika", "Konteyner tashish", "Dengiz tashish", "Ekspeditorlik"], description: "Xalqaro logistika kompaniyasi, avto/temir yo'l/dengiz/havo tashish, bojxona rasmiylashtirilishi", years_on_site: 4, likes: 1237 },
  { name: "HIGH SPEED LOGISTICS", region: "Toshkent", district: "Yakkasaroy tumani", address: "100121, ул. Ш.Руставели, 81/13", phone_prefix: "+998 55 500", services: ["Logistika", "Ekspeditorlik", "Havo yuk tashish", "Avto yuk tashish"], tags: ["Ishlab chiqaruvchi", "Eksportyor"], years_on_site: 9, likes: 954 },
  { name: "FRACHT SILK ROAD", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100015, пр-т Махтумкули, 45", phone_prefix: "+998 71 200", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 0, likes: 0 },
  { name: "FLY KHIVA", region: "Toshkent", district: "Yakkasaroy tumani", address: "ул. Нукусская, 91/1", phone_prefix: "+998 88 007", services: ["Logistika", "Havo yuk tashish", "Xalqaro yuk tashish"], years_on_site: 0, likes: 8, work_mode: "24/7" },
  { name: "ROUTE LOGISTIC", region: "Toshkent", district: "Yangihayot tumani", address: "пр-т Шоликор, 100-В", phone_prefix: "+998 99 889", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 0, likes: 0, work_mode: "24/7" },
  { name: "TAKLOG INDUSTRY", region: "Toshkent", district: "Mirobod tumani", address: "ул. А.Каххара, 56А", phone_prefix: "+998 71 255", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], years_on_site: 0, likes: 0, work_mode: "24/7" },
  { name: "TETAL", region: "Toshkent", district: "Yunusobod tumani", address: "кв-л Юнусабад-4, 45", phone_prefix: "+998 50 754", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], tags: ["Eksportyor"], years_on_site: 0, likes: 0, work_mode: "24/7" },
  { name: "ABBOS AVTO TRANS", region: "Buxoro viloyati", district: "Buxoro", address: "200100, шоссе Газлийское, 13/7", phone_prefix: "+998 90 637", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], years_on_site: 1, likes: 4 },
  { name: "ABSOLUTE LOGISTICS", region: "Toshkent", district: "Yunusobod tumani", address: "ул. Богишамол, 57", phone_prefix: "+998 97 139", services: ["Logistika", "Ekspeditorlik", "Havo yuk tashish", "Avto yuk tashish"], years_on_site: 3, likes: 13 },
  { name: "ADF INDIVIDUAL CARGO", region: "Toshkent", district: "Yangihayot tumani", address: "ул. Райхон, 1", phone_prefix: "+998 94 241", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], tags: ["Eksportyor"], years_on_site: 1, likes: 4 },
  { name: "ADL ULANISH", region: "Toshkent", district: "Chilonzor tumani", address: "пр-т Бунёдкор, 47", phone_prefix: "+998 91 010", services: ["Logistika", "Transport kompaniyasi"], tags: ["Eksportyor"], years_on_site: 2, likes: 0 },
  { name: "AIRCUZ SERVICE", region: "Toshkent", district: "Chilonzor tumani", address: "100097, пр-т Бунёдкор, 44", phone_prefix: "+998 77 353", services: ["Logistika", "Xalqaro yuk tashish"], years_on_site: 3, likes: 8 },
  { name: "AKELA GROUP", legal_name: "AKELA GROUP MACHINERY OOO", region: "Toshkent viloyati", district: "Zangiota tumani", address: "111818, тракт Большой узбекский", phone_prefix: "+998 97 000", services: ["Logistika"], tags: ["Ishlab chiqaruvchi", "Eksportyor"], years_on_site: 10, likes: 4 },
  { name: "AKSHA LOGISTIC", region: "Toshkent", district: "Yashnobod tumani", address: "100147, ул. Фаргона Йули, 567", phone_prefix: "+998 91 857", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], years_on_site: 0, likes: 0 },
  { name: "ALEX GROUP CORP", region: "Toshkent", district: "Yashnobod tumani", address: "100007, ул. Султанали Машхади, 95/97", phone_prefix: "+998 90 015", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], tags: ["Eksportyor"], years_on_site: 1, likes: 0 },
  { name: "ALFA MAIL", region: "Toshkent", district: "Mirobod tumani", address: "100029, ул. Якуба Коласа, 2", phone_prefix: "+998 88 160", services: ["Logistika", "Kuryerlik xizmatlari"], years_on_site: 0, likes: 0 },
  { name: "ALINE", legal_name: "ALINE TRANSPORT OOO", region: "Toshkent", district: "Yakkasaroy tumani", address: "100031, ул. Кухинур, 1/1", phone_prefix: "+998 90 628", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], years_on_site: 4, likes: 5 },
  { name: "ALL CARGO", legal_name: "ALLCARGO OOO", region: "Toshkent", district: "Mirobod tumani", address: "100015, ул. Айбека, 18/1", phone_prefix: "+998 97 143", services: ["Logistika", "Dengiz tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 6, likes: 41 },
  { name: "ALLTERRA LOGISTIC", region: "Toshkent", district: "Mirzo Ulug'bek tumani", address: "100000, м-в Буюк Ипак Йули, 47/1", phone_prefix: "+998 33 404", services: ["Logistika", "Ekspeditorlik", "Transport kompaniyasi"], years_on_site: 2, likes: 4 },
  { name: "ALLTIME", legal_name: "ALLTIME PROJECTS OOO", region: "Toshkent", district: "Mirobod tumani", address: "100105, ул. Сарыкуль, 32/2", phone_prefix: "+998 90 319", services: ["Logistika", "Ekspeditorlik", "Avto yuk tashish"], tags: ["Ishlab chiqaruvchi"], years_on_site: 1, likes: 4 },
  { name: "ARDENA GROUP", legal_name: "ARDENA CENTRAL ASIA OOO", region: "Toshkent", district: "Shayxontohur tumani", address: "100021, ул. Фурката, 2А", phone_prefix: "+998 71 205", services: ["Logistika", "Konteyner tashish", "Ekspeditorlik", "Havo yuk tashish"], years_on_site: 15, likes: 106 },
];

const REGION_CENTROIDS = {
  "Toshkent": [41.2995, 69.2401],
  "Toshkent viloyati": [41.05, 69.35],
  "Andijon viloyati": [40.7833, 72.35],
  "Buxoro viloyati": [39.7747, 64.4286],
  "Farg'ona viloyati": [40.3864, 71.7864],
  "Jizzax viloyati": [40.1158, 67.8422],
  "Xorazm viloyati": [41.55, 60.6333],
  "Namangan viloyati": [40.9983, 71.6726],
  "Navoiy viloyati": [40.0844, 65.3792],
  "Qashqadaryo viloyati": [38.86, 65.7891],
  "Samarqand viloyati": [39.6542, 66.9758],
  "Sirdaryo viloyati": [40.8367, 68.6606],
  "Surxondaryo viloyati": [37.9401, 67.5719],
  "Qoraqalpog'iston": [42.4531, 59.6103],
};

const DEMO_REGIONS = Object.keys(REGION_CENTROIDS);
const DEMO_NAME_PREFIXES = [
  "Amir Temur", "Atlas", "Bunyodkor", "Central Asia", "Chinor", "Grand Route", "Ipak Yuli", "Navruz",
  "Orient", "Registon", "Sahro", "Samandar", "Silk Road", "Turon", "Ulugbek", "Uzbekistan",
];
const DEMO_NAME_SUFFIXES = ["Cargo", "Express", "Logistics", "Trans", "Transport"];
const DEMO_SERVICE_SETS = [
  ["Logistika", "Avto yuk tashish", "Ekspeditorlik"],
  ["Logistika", "Konteyner tashish", "Xalqaro yuk tashish"],
  ["Logistika", "Havo yuk tashish", "Kuryerlik xizmatlari"],
  ["Logistika", "Dengiz tashish", "Bojxona omborxonasi"],
  ["Logistika", "Transport kompaniyasi", "Yuklash-tushirish ishlari"],
];

const DEMO_COMPANIES = Array.from({ length: 80 }, (_, index) => {
  const sequence = index + 1;
  const region = DEMO_REGIONS[index % DEMO_REGIONS.length];
  const prefix = DEMO_NAME_PREFIXES[index % DEMO_NAME_PREFIXES.length];
  const suffix = DEMO_NAME_SUFFIXES[Math.floor(index / DEMO_NAME_PREFIXES.length)];
  const operatorCode = 90 + (index % 10);
  const phoneGroup = String(100 + index).padStart(3, "0");

  return {
    name: `${prefix} ${suffix}`,
    legal_name: `${prefix.toUpperCase()} ${suffix.toUpperCase()} MCHJ`,
    region,
    district: null,
    address: `${region}, logistika markazi ${sequence}`,
    phone_prefix: `+998 ${operatorCode} ${phoneGroup}`,
    services: DEMO_SERVICE_SETS[index % DEMO_SERVICE_SETS.length],
    description: "Namoyish katalogi uchun yaratilgan logistika kompaniyasi profili.",
    years_on_site: index % 12,
    likes: 25 + index * 17,
    work_mode: index % 7 === 0 ? "24/7" : "09:00-18:00",
    tags: index % 9 === 0 ? ["Eksportyor"] : [],
    is_demo: true,
  };
});

const ALL_COMPANIES = [...RAW, ...DEMO_COMPANIES];

// Deterministic hash -> [0,1) so re-running the generator produces stable coordinates.
function hash01(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function slugify(name, seen) {
  const base = name
    .toLowerCase()
    .replace(/["'()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  let slug = base;
  let i = 2;
  while (seen.has(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  seen.add(slug);
  return slug;
}

const seenSlugs = new Set();

const companies = ALL_COMPANIES.map((c) => {
  const [baseLat, baseLng] = REGION_CENTROIDS[c.region] ?? REGION_CENTROIDS["Toshkent"];
  const jitterLat = (hash01(c.name + "lat") - 0.5) * 0.25;
  const jitterLng = (hash01(c.name + "lng") - 0.5) * 0.25;
  const tags = c.tags ?? [];

  return {
    name: c.name,
    legalName: c.legal_name ?? null,
    slug: slugify(c.name, seenSlugs),
    region: c.region,
    district: c.district ?? null,
    address: c.address ?? null,
    phonePrefix: c.phone_prefix ?? null,
    phoneFull: c.phone_prefix ? `${c.phone_prefix}-XX-XX` : null,
    description: c.description ?? null,
    latitude: Number((baseLat + jitterLat).toFixed(6)),
    longitude: Number((baseLng + jitterLng).toFixed(6)),
    yearsOnSite: c.years_on_site ?? 0,
    likesCount: c.likes ?? 0,
    workMode: c.work_mode ?? "09:00-18:00",
    isProducer: tags.includes("Ishlab chiqaruvchi"),
    isExporter: tags.includes("Eksportyor"),
    sourceUrl: c.is_demo ? null : "https://www.goldenpages.uz/rubrics/?Id=4676",
    sourceId: null,
    services: c.services,
  };
});

const output = {
  source: "goldenpages.uz/rubrics/?Id=4676 (Логистические компании Узбекистана)",
  total_found_on_source: 242,
  note:
    "120 ta kompaniyadan iborat namunaviy to'plam: 40 ta manba saytining 1-2 sahifasidan qo'lda yig'ilgan va 80 ta aniq belgilangan demo profil.",
  companies,
};

writeFileSync(
  new URL("../data/companies_seed.json", import.meta.url),
  JSON.stringify(output, null, 2) + "\n",
  "utf-8",
);

console.log(`Wrote ${companies.length} companies to data/companies_seed.json`);
