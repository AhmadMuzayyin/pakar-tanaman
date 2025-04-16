import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const plants = await prisma.plant.findMany();
        return res.status(200).json(plants);
    }

    if (req.method === "POST") {
        const { name, type, growingPeriod, tempMin, tempMax, humidityMin, humidityMax, rainResistance, idealSeason, notes } = req.body;
        const newPlant = await prisma.plant.create({
            data: {
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
            },
        });
        return res.status(201).json(newPlant);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}