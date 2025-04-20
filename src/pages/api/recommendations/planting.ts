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
        // Verify API key exists
        if (!API_KEY) {
            console.error("OpenWeatherMap API key is missing");
            return res.status(500).json({ error: "API configuration error" });
        }

        const weatherResponse = await axios.get(BASE_URL, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: "metric",
            },
        });

        const weatherData = weatherResponse.data.list;

        if (!weatherData || !Array.isArray(weatherData)) {
            console.error("Invalid weather data format:", weatherResponse.data);
            return res.status(500).json({ error: "Invalid weather data format" });
        }

        const plants = await prisma.plant.findMany();

        if (!plants || plants.length === 0) {
            console.warn("No plants found in database");
        }

        const recommendations = plants.map((plant) => {
            const suitableDays = weatherData.filter((day: { main: { temp: number; humidity: number } }) => {
                if (!day.main) {
                    console.warn("Weather data entry missing 'main' property:", day);
                    return false;
                }

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
                plantId: plant.id,
                plantType: plant.type,
                growingPeriod: plant.growingPeriod,
                idealSeason: plant.idealSeason
            };
        });

        return res.status(200).json(recommendations);
    } catch (error) {
        console.error("Recommendation API error:", error);
        // Fix TypeScript error by checking error type
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({ error: "Failed to fetch recommendations", message: errorMessage });
    }
}