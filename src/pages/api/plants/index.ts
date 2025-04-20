import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get the user session
    const session = await getServerSession(req, res, authOptions);

    if (req.method === "GET") {
        // If user is logged in, get public plants + user's own plants
        // If not logged in, only get public plants
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
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(plants);
    }

    if (req.method === "POST") {
        // Check if user is authenticated
        if (!session?.user?.id) {
            return res.status(401).json({ error: "Anda harus login untuk menambahkan tanaman" });
        }

        const { name, type, growingPeriod, tempMin, tempMax, humidityMin, humidityMax, rainResistance, idealSeason, notes, isPublic = false } = req.body;

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
                userId: parseInt(session.user.id), // Add the user ID
                isPublic, // Set visibility (default to false - only visible to the user)
                createdAt: new Date(),
                updatedAt: new Date()
            }])
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(newPlant);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}