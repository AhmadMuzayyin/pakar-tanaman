import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateUsers() {
    console.log('Migrasi pengguna...');
    const users = await prisma.user.findMany();

    if (users.length > 0) {
        const { data, error } = await supabase.from('User').insert(users);

        if (error) {
            console.error('Error saat migrasi pengguna:', error);
        } else {
            console.log(`${users.length} pengguna berhasil dimigrasi.`);
        }
    } else {
        console.log('Tidak ada pengguna untuk dimigrasi.');
    }
}

async function migratePlants() {
    console.log('Migrasi tanaman...');
    const plants = await prisma.plant.findMany();

    if (plants.length > 0) {
        const { data, error } = await supabase.from('Plant').insert(plants);

        if (error) {
            console.error('Error saat migrasi tanaman:', error);
        } else {
            console.log(`${plants.length} tanaman berhasil dimigrasi.`);
        }
    } else {
        console.log('Tidak ada tanaman untuk dimigrasi.');
    }
}

async function migratePlantings() {
    console.log('Migrasi penanaman...');
    const plantings = await prisma.planting.findMany();

    if (plantings.length > 0) {
        const { data, error } = await supabase.from('Planting').insert(plantings);

        if (error) {
            console.error('Error saat migrasi penanaman:', error);
        } else {
            console.log(`${plantings.length} penanaman berhasil dimigrasi.`);
        }
    } else {
        console.log('Tidak ada penanaman untuk dimigrasi.');
    }
}

async function migratePlantingLogs() {
    console.log('Migrasi catatan penanaman...');
    const logs = await prisma.plantingLog.findMany();

    if (logs.length > 0) {
        const { data, error } = await supabase.from('PlantingLog').insert(logs);

        if (error) {
            console.error('Error saat migrasi catatan penanaman:', error);
        } else {
            console.log(`${logs.length} catatan penanaman berhasil dimigrasi.`);
        }
    } else {
        console.log('Tidak ada catatan penanaman untuk dimigrasi.');
    }
}

async function migrateWeatherData() {
    console.log('Migrasi data cuaca...');
    const weatherData = await prisma.weatherData.findMany();

    if (weatherData.length > 0) {
        const { data, error } = await supabase.from('WeatherData').insert(weatherData);

        if (error) {
            console.error('Error saat migrasi data cuaca:', error);
        } else {
            console.log(`${weatherData.length} data cuaca berhasil dimigrasi.`);
        }
    } else {
        console.log('Tidak ada data cuaca untuk dimigrasi.');
    }
}

async function main() {
    try {
        console.log('Memulai migrasi ke Supabase...');

        await migrateUsers();
        await migratePlants();
        await migratePlantings();
        await migratePlantingLogs();
        await migrateWeatherData();

        console.log('Migrasi selesai dengan sukses.');
    } catch (error) {
        console.error('Error selama proses migrasi:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();