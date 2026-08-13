-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT,
    "address" TEXT,
    "phonePrefix" TEXT,
    "phoneFull" TEXT,
    "description" TEXT,
    "website" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "yearsOnSite" INTEGER,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "workMode" TEXT,
    "isProducer" BOOLEAN NOT NULL DEFAULT false,
    "isExporter" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "sourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameRu" TEXT,
    "nameEn" TEXT
);

-- CreateTable
CREATE TABLE "CompanyService" (
    "companyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    PRIMARY KEY ("companyId", "serviceId"),
    CONSTRAINT "CompanyService_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "originRegion" TEXT NOT NULL,
    "destRegion" TEXT NOT NULL,
    "cargoType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "etaHours" INTEGER,
    "currentLat" REAL,
    "currentLng" REAL,
    "costUsd" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RealtimeMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT,
    "metricType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RealtimeMetric_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForecastPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    "historicalValue" REAL,
    "forecastValue" REAL,
    "lowerBound" REAL,
    "upperBound" REAL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_region_idx" ON "Company"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
