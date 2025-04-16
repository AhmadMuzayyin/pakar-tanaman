import { createClient } from '@supabase/supabase-js';

// Mendapatkan variabel lingkungan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Membuat klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);