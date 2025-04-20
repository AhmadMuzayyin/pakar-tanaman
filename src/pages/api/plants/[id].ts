import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { handleSupabaseError } from '@/lib/supabaseHelpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Get the user session
        const session = await getServerSession(req, res, authOptions);

        // Get the plant ID from the request
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "ID tanaman tidak valid" });
        }

        // Check if the plant exists and if the user has permission
        const { data: plant, error: fetchError } = await supabase
            .from('Plant')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            // Differentiate between not found and server error
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({ error: "Tanaman tidak ditemukan" });
            }

            const errorResponse = handleSupabaseError(fetchError, 'saat mencari tanaman');
            return res.status(500).json(errorResponse);
        }

        if (!plant) {
            return res.status(404).json({ error: "Tanaman tidak ditemukan" });
        }

        // For PUT and DELETE operations, verify user is the owner
        if ((req.method === "PUT" || req.method === "DELETE") &&
            (!session?.user?.id || plant.userId !== parseInt(session.user.id as string))) {
            return res.status(403).json({ error: "Anda tidak memiliki izin untuk mengubah tanaman ini" });
        }

        // Handle GET request - anyone can get a plant if it's public or they own it
        if (req.method === "GET") {
            if (plant.isPublic || (session?.user?.id && plant.userId === parseInt(session.user.id as string))) {
                return res.status(200).json(plant);
            } else {
                return res.status(403).json({ error: "Anda tidak memiliki izin untuk melihat tanaman ini" });
            }
        }

        // Handle PUT request - update a plant
        if (req.method === "PUT") {
            const {
                name, type, growingPeriod, tempMin, tempMax,
                humidityMin, humidityMax, rainResistance, idealSeason,
                notes, isPublic
            } = req.body;

            // Validasi data
            if (!name || !type) {
                return res.status(400).json({ error: "Nama dan jenis tanaman harus diisi" });
            }

            try {
                const { data: updatedPlant, error: updateError } = await supabase
                    .from('Plant')
                    .update({
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
                        isPublic,
                        updatedAt: new Date()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (updateError) {
                    const errorResponse = handleSupabaseError(updateError, 'saat memperbarui tanaman');
                    return res.status(500).json(errorResponse);
                }

                return res.status(200).json(updatedPlant);
            } catch (err: any) {
                console.error("Error updating plant:", err);
                return res.status(500).json({ error: "Gagal memperbarui tanaman. Silakan coba lagi." });
            }
        }

        // Handle DELETE request - delete a plant
        if (req.method === "DELETE") {
            try {
                const { error: deleteError } = await supabase
                    .from('Plant')
                    .delete()
                    .eq('id', id);

                if (deleteError) {
                    const errorResponse = handleSupabaseError(deleteError, 'saat menghapus tanaman');
                    return res.status(500).json(errorResponse);
                }

                return res.status(200).json({ message: "Tanaman berhasil dihapus" });
            } catch (err: any) {
                console.error("Error deleting plant:", err);
                return res.status(500).json({ error: "Gagal menghapus tanaman. Silakan coba lagi." });
            }
        }

        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (err: any) {
        console.error("Unhandled error in plants/[id] API:", err);
        return res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
    }
}