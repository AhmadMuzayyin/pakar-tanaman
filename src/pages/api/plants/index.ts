import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { handleSupabaseError } from '@/lib/supabaseHelpers';

// Helper untuk validasi data tanaman
const validatePlantData = (data: any) => {
    const errors = [];
    if (!data.name) errors.push("Nama tanaman harus diisi");
    if (!data.type) errors.push("Jenis tanaman harus diisi");

    return {
        isValid: errors.length === 0,
        errors
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Pastikan metode HTTP didukung
    const { method } = req;

    if (method !== "GET" && method !== "POST") {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Metode ${method} tidak diizinkan` });
    }

    try {
        // Get the user session
        const session = await getServerSession(req, res, authOptions);

        // Handler untuk GET request
        if (method === "GET") {
            let query = supabase.from('Plant').select('*');

            if (session?.user?.id) {
                // Get public plants OR plants created by this user
                query = query.or(`isPublic.eq.true,userId.eq.${session.user.id}`);
            } else {
                // Only get public plants
                query = query.eq('isPublic', true);
            }

            const { data: plants, error } = await query;

            if (error) {
                const errorResponse = handleSupabaseError(error, 'saat mengambil data tanaman');
                return res.status(500).json(errorResponse);
            }

            return res.status(200).json(plants || []);
        }

        // Handler untuk POST request
        if (method === "POST") {
            // Check authentication
            if (!session?.user?.id) {
                return res.status(401).json({
                    error: "Unauthorized",
                    message: "Anda harus login untuk menambahkan tanaman"
                });
            }

            const plantData = req.body;

            // Validasi data
            const { isValid, errors } = validatePlantData(plantData);

            if (!isValid) {
                return res.status(400).json({
                    error: "ValidationError",
                    message: "Validasi data gagal",
                    details: errors
                });
            }

            const {
                name, type, growingPeriod, tempMin, tempMax,
                humidityMin, humidityMax, rainResistance,
                idealSeason, notes, isPublic = false
            } = plantData;

            try {
                const { data: newPlant, error } = await supabase
                    .from('Plant')
                    .insert([{
                        name,
                        type,
                        growingPeriod,
                        tempMin,
                        tempMax,
                        humidityMin,
                        humidityMax,
                        rainResistance,
                        idealSeason,
                        notes,
                        userId: parseInt(session.user.id),
                        isPublic,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }])
                    .select()
                    .single();

                if (error) {
                    const errorResponse = handleSupabaseError(error, 'saat menambahkan tanaman');
                    return res.status(500).json(errorResponse);
                }

                return res.status(201).json(newPlant);
            } catch (err: any) {
                console.error("Error adding plant:", err);
                return res.status(500).json({
                    error: "ServerError",
                    message: "Gagal menambahkan tanaman. Silakan coba lagi."
                });
            }
        }
    } catch (err: any) {
        console.error("Unhandled error in plants API:", err);
        return res.status(500).json({
            error: "ServerError",
            message: "Terjadi kesalahan pada server. Silakan coba lagi nanti."
        });
    }
}