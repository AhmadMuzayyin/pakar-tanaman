import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data tanaman awal
const plantData = [
    {
        name: 'Padi',
        type: 'Biji-bijian',
        growingPeriod: 120,
        tempMin: 22,
        tempMax: 30,
        humidityMin: 70,
        humidityMax: 90,
        rainResistance: 'Tinggi',
        idealSeason: 'Hujan',
        notes: 'Tanaman padi memerlukan banyak air dan sinar matahari yang cukup.'
    },
    {
        name: 'Jagung',
        type: 'Biji-bijian',
        growingPeriod: 100,
        tempMin: 20,
        tempMax: 32,
        humidityMin: 60,
        humidityMax: 85,
        rainResistance: 'Sedang',
        idealSeason: 'Kemarau',
        notes: 'Jagung membutuhkan drainase yang baik dan paparan sinar matahari penuh.'
    },
    {
        name: 'Kedelai',
        type: 'Kacang-kacangan',
        growingPeriod: 90,
        tempMin: 20,
        tempMax: 30,
        humidityMin: 60,
        humidityMax: 80,
        rainResistance: 'Sedang',
        idealSeason: 'Kemarau',
        notes: 'Kedelai dapat tumbuh di berbagai jenis tanah dengan drainase yang baik.'
    },
    {
        name: 'Cabai',
        type: 'Sayuran',
        growingPeriod: 80,
        tempMin: 21,
        tempMax: 32,
        humidityMin: 60,
        humidityMax: 80,
        rainResistance: 'Rendah',
        idealSeason: 'Kemarau',
        notes: 'Cabai membutuhkan sinar matahari penuh dan tanah yang kaya nutrisi.'
    },
    {
        name: 'Tomat',
        type: 'Sayuran',
        growingPeriod: 70,
        tempMin: 20,
        tempMax: 30,
        humidityMin: 65,
        humidityMax: 85,
        rainResistance: 'Rendah',
        idealSeason: 'Kemarau',
        notes: 'Tomat membutuhkan penyangga dan rentan terhadap penyakit saat kelembaban tinggi.'
    },
    {
        name: 'Kentang',
        type: 'Umbi',
        growingPeriod: 100,
        tempMin: 15,
        tempMax: 25,
        humidityMin: 60,
        humidityMax: 80,
        rainResistance: 'Sedang',
        idealSeason: 'Kemarau',
        notes: 'Kentang tumbuh baik di dataran tinggi dengan suhu sejuk.'
    },
    {
        name: 'Bawang Merah',
        type: 'Umbi',
        growingPeriod: 60,
        tempMin: 18,
        tempMax: 30,
        humidityMin: 65,
        humidityMax: 75,
        rainResistance: 'Rendah',
        idealSeason: 'Kemarau',
        notes: 'Bawang merah membutuhkan cahaya matahari penuh dan tanah dengan drainase yang baik.'
    },
    {
        name: 'Wortel',
        type: 'Umbi',
        growingPeriod: 75,
        tempMin: 15,
        tempMax: 25,
        humidityMin: 60,
        humidityMax: 80,
        rainResistance: 'Sedang',
        idealSeason: 'Semua',
        notes: 'Wortel membutuhkan tanah gembur dan dalam untuk perkembangan akar yang baik.'
    },
    {
        name: 'Bayam',
        type: 'Sayuran',
        growingPeriod: 30,
        tempMin: 18,
        tempMax: 30,
        humidityMin: 60,
        humidityMax: 85,
        rainResistance: 'Tinggi',
        idealSeason: 'Semua',
        notes: 'Bayam adalah tanaman yang cepat tumbuh dan toleran terhadap berbagai kondisi.'
    },
    {
        name: 'Kangkung',
        type: 'Sayuran',
        growingPeriod: 25,
        tempMin: 20,
        tempMax: 35,
        humidityMin: 70,
        humidityMax: 90,
        rainResistance: 'Tinggi',
        idealSeason: 'Semua',
        notes: 'Kangkung dapat tumbuh di tanah kering atau di air (sistem hidroponik sederhana).'
    }
];

async function main() {
    console.log('Mulai seeding database...');

    // Bersihkan database terlebih dahulu jika perlu
    // await prisma.plant.deleteMany();

    // Tambahkan data tanaman
    for (const plant of plantData) {
        const createdPlant = await prisma.plant.create({
            data: plant
        });
        console.log(`Tanaman ${createdPlant.name} telah ditambahkan`);
    }

    console.log('Seeding selesai.');
}

main()
    .catch((e) => {
        console.error('Error selama seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });