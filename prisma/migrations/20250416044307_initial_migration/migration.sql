-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "growingPeriod" INTEGER NOT NULL,
    "tempMin" DOUBLE PRECISION NOT NULL,
    "tempMax" DOUBLE PRECISION NOT NULL,
    "humidityMin" DOUBLE PRECISION NOT NULL,
    "humidityMax" DOUBLE PRECISION NOT NULL,
    "rainResistance" TEXT NOT NULL,
    "idealSeason" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plantId" INTEGER NOT NULL,
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "expectedHarvestDate" TIMESTAMP(3) NOT NULL,
    "actualHarvestDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantingLog" (
    "id" SERIAL NOT NULL,
    "plantingId" INTEGER NOT NULL,
    "logType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherData" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tempMin" DOUBLE PRECISION NOT NULL,
    "tempMax" DOUBLE PRECISION NOT NULL,
    "tempAvg" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "conditions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Planting" ADD CONSTRAINT "Planting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planting" ADD CONSTRAINT "Planting_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantingLog" ADD CONSTRAINT "PlantingLog_plantingId_fkey" FOREIGN KEY ("plantingId") REFERENCES "Planting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
