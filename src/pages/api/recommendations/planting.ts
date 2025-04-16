import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
        const weatherResponse = await axios.get(BASE_URL, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: "metric",
            },
        });

        const weatherData = weatherResponse.data.list;
        const plants = await prisma.plant.findMany();

        const recommendations = plants.map((plant) => {
            const suitableDays = weatherData.filter((day: { main: { temp: number; humidity: number } }) => {
                const temp = day.main.temp;
                const humidity = day.main.humidity;
                return (
                    temp >= plant.tempMin &&
                    temp <= plant.tempMax &&
                    humidity >= plant.humidityMin &&
                    humidity <= plant.humidityMax
                );
            });

            return {
                plant: plant.name,
                suitableDays: suitableDays.length,
            };
        });

        return res.status(200).json(recommendations);
    } catch {
        return res.status(500).json({ error: "Failed to fetch recommendations" });
    }
}