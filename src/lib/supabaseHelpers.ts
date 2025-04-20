import { supabase, checkSupabaseConnection } from './supabase';

/**
 * Fungsi bantuan untuk berinteraksi dengan Supabase
 */

// Fungsi untuk menangani error dari Supabase dengan lebih baik
export function handleSupabaseError(error: any, context: string) {
    console.error(`Error ${context}:`, error);

    // Deteksi jenis error untuk pesan yang lebih spesifik
    if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
        return { error: 'Sesi otentikasi telah kedaluwarsa. Silakan login kembali.' };
    }

    if (error.code?.startsWith('P')) {
        return { error: 'Terjadi kesalahan pada database. Silakan coba lagi nanti.' };
    }

    if (error.code === '23505') {
        return { error: 'Data sudah ada dalam database.' };
    }

    // Error umum
    return { error: 'Terjadi kesalahan saat mengakses data. Silakan coba lagi nanti.' };
}

// Wrapper untuk memastikan koneksi ada sebelum melakukan operasi database
async function withConnectionCheck(operation: Function, errorContext: string, ...args: any[]) {
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
        console.error(`Supabase connection failed for ${errorContext}`);
        return { error: 'Tidak dapat terhubung ke database. Periksa koneksi internet Anda.' };
    }

    try {
        return await operation(...args);
    } catch (error) {
        return handleSupabaseError(error, errorContext);
    }
}

// Contoh pengambilan data pengguna
export async function getUsers() {
    return withConnectionCheck(async () => {
        const { data, error } = await supabase
            .from('User')
            .select('*');

        if (error) {
            return handleSupabaseError(error, 'saat mengambil data pengguna');
        }

        return { data };
    }, 'getUsers');
}

// Contoh pembuatan pengguna baru
export async function createUser(user: { name: string; email: string; password: string; location: string }) {
    return withConnectionCheck(async () => {
        const { data, error } = await supabase
            .from('User')
            .insert([user])
            .select();

        if (error) {
            return handleSupabaseError(error, 'saat membuat pengguna baru');
        }

        return { data: data[0] };
    }, 'createUser', user);
}

// Contoh pengambilan data tanaman
export async function getPlants() {
    return withConnectionCheck(async () => {
        const { data, error } = await supabase
            .from('Plant')
            .select('*');

        if (error) {
            return handleSupabaseError(error, 'saat mengambil data tanaman');
        }

        return { data };
    }, 'getPlants');
}

// Contoh pengambilan data cuaca
export async function getWeatherData(location: string) {
    return withConnectionCheck(async () => {
        const { data, error } = await supabase
            .from('WeatherData')
            .select('*')
            .eq('location', location)
            .order('date', { ascending: false })
            .limit(1);

        if (error) {
            return handleSupabaseError(error, 'saat mengambil data cuaca');
        }

        return { data: data[0] };
    }, 'getWeatherData', location);
}