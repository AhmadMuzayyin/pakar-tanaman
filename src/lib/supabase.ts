import { createClient } from '@supabase/supabase-js';

// Mendapatkan variabel lingkungan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Deklarasi global untuk Supabase Client
declare global {
    var supabaseClient: ReturnType<typeof createClient> | undefined;
}

// Validasi variabel lingkungan
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables'
    );
    // Tidak menggunakan throw error karena bisa menyebabkan build error
}

// Membuat klien Supabase dengan singleton pattern
function createSupabaseClient() {
    if (supabaseUrl && supabaseAnonKey) {
        return createClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                auth: {
                    persistSession: true,
                },
            }
        );
    }
    // Fallback jika environment variables tidak tersedia
    // Ini akan mengembalikan client yang tidak berfungsi, tetapi
    // mencegah aplikasi crash pada kompilasi
    return createClient(
        'https://placeholder-url.supabase.co',
        'placeholder-key',
        {
            auth: {
                persistSession: true,
            },
        }
    );
}

// Menggunakan singleton pattern untuk mencegah multiple connections
export const supabase =
    global.supabaseClient ||
    (global.supabaseClient = createSupabaseClient());

// Hindari pembuatan koneksi berlebih selama hot reload di development
if (process.env.NODE_ENV !== "production") {
    global.supabaseClient = supabase;
}

// Fungsi bantu untuk memeriksa konektivitas
export async function checkSupabaseConnection() {
    try {
        // Coba kueri sederhana untuk memverifikasi koneksi
        const { data, error } = await supabase.from('User').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Failed to connect to Supabase:', err);
        return false;
    }
}