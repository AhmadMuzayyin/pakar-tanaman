import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
            return res.status(500).json({ error: updateError.message });
        }

        return res.status(200).json(updatedPlant);
    }

    // Handle DELETE request - delete a plant
    if (req.method === "DELETE") {
        const { error: deleteError } = await supabase
            .from('Plant')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: "Tanaman berhasil dihapus" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}