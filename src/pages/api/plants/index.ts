import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { data: plants, error } = await supabase
            .from('Plant')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(plants);
    }

    if (req.method === "POST") {
        const { name, type, growingPeriod, tempMin, tempMax, humidityMin, humidityMax, rainResistance, idealSeason, notes } = req.body;

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