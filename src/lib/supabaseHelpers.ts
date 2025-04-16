import { supabase } from './supabase';

/**
 * Fungsi bantuan untuk berinteraksi dengan Supabase
 */

// Contoh pengambilan data pengguna
export async function getUsers() {
    const { data, error } = await supabase
        .from('User')
        .select('*');

    if (error) {
        console.error('Error saat mengambil data pengguna:', error);
        return null;
    }

    return data;
}

// Contoh pembuatan pengguna baru
export async function createUser(user: { name: string; email: string; password: string; location: string }) {
    const { data, error } = await supabase
        .from('User')
        .insert([user])
        .select();

    if (error) {
        console.error('Error saat membuat pengguna baru:', error);
        return null;
    }

    return data[0];
}

// Contoh pengambilan data tanaman
export async function getPlants() {
    const { data, error } = await supabase
        .from('Plant')
        .select('*');

    if (error) {
        console.error('Error saat mengambil data tanaman:', error);
        return null;
    }

    return data;
}

// Contoh pengambilan data cuaca
export async function getWeatherData(location: string) {
    const { data, error } = await supabase
        .from('WeatherData')
        .select('*')
        .eq('location', location)
        .order('date', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error saat mengambil data cuaca:', error);
        return null;
    }

    return data[0];
}