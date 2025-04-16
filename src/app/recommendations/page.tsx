"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Recommendation = {
    plant: string;
    suitableDays: number;
};

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [location, setLocation] = useState({ lat: "", lon: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

    useEffect(() => {
        // Check if geolocation is supported by the browser
        if ("geolocation" in navigator) {
            setDetectedLocation("Mendeteksi lokasi Anda...");

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        lat: latitude.toFixed(6),
                        lon: longitude.toFixed(6)
                    });
                    setDetectedLocation("Lokasi terdeteksi");

                    // Get location name using reverse geocoding
                    fetchLocationName(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting location:", err);
                    setDetectedLocation("Gagal mendeteksi lokasi");
                }
            );
        } else {
            setDetectedLocation("Geolokasi tidak didukung di browser Anda");
        }
    }, []);

    const fetchLocationName = async (lat: number, lon: number) => {
        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = response.data;

            if (data && data.display_name) {
                // Extract useful parts from display_name
                const nameParts = data.display_name.split(", ");
                // Take only the first few parts that identify the location more specifically
                const locationName = nameParts.slice(0, 3).join(", ");
                setDetectedLocation(locationName);
            }
        } catch (error) {
            console.error("Error fetching location name:", error);
        }
    };

    const fetchRecommendations = async () => {
        if (!location.lat || !location.lon) {
            setError("Latitude dan longitude diperlukan");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/recommendations/planting`, {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                },
            });

            // Sort recommendations by suitability (highest first)
            const sortedRecommendations = response.data.sort(
                (a: Recommendation, b: Recommendation) => b.suitableDays - a.suitableDays
            );

            setRecommendations(sortedRecommendations);
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
            setError("Gagal mendapatkan rekomendasi tanaman. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate suitability percentage (assuming forecast is for 5 days with 8 readings per day = 40 total)
    const calculateSuitability = (days: number) => {
        const totalPossibleReadings = 40; // 5 days × 8 readings per day
        const percentage = (days / totalPossibleReadings) * 100;
        return Math.round(percentage);
    };

    // Generate appropriate color class based on suitability percentage
    const getSuitabilityColorClass = (days: number) => {
        const percentage = calculateSuitability(days);

        if (percentage >= 80) return "bg-green-500";
        if (percentage >= 60) return "bg-green-400";
        if (percentage >= 40) return "bg-yellow-400";
        if (percentage >= 20) return "bg-orange-400";
        return "bg-red-400";
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Rekomendasi Penanaman</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Masukkan Lokasi Anda</h2>

                {detectedLocation && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-700 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {detectedLocation}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                            type="text"
                            value={location.lat}
                            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Contoh: -6.200000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                            type="text"
                            value={location.lon}
                            onChange={(e) => setLocation({ ...location, lon: e.target.value })}
                            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Contoh: 106.816666"
                        />
                    </div>
                </div>

                <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className={`${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        } text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memuat...
                        </>
                    ) : (
                        "Dapatkan Rekomendasi"
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Hasil Rekomendasi Tanaman</h2>
                    <p className="text-gray-600 mb-6">
                        Berdasarkan kondisi cuaca di lokasi Anda untuk 5 hari ke depan, berikut adalah tanaman yang paling cocok untuk ditanam:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="border rounded-lg overflow-hidden flex flex-col"
                            >
                                <div className={`${getSuitabilityColorClass(rec.suitableDays)} text-white p-3`}>
                                    <h3 className="font-semibold">{rec.plant}</h3>
                                </div>
                                <div className="p-4 bg-white flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Tingkat Kesesuaian:</span>
                                            <span className="font-semibold">{calculateSuitability(rec.suitableDays)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${getSuitabilityColorClass(rec.suitableDays)}`}
                                                style={{ width: `${calculateSuitability(rec.suitableDays)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-3">
                                        {rec.suitableDays} dari 40 slot waktu memiliki kondisi yang cocok untuk tanaman ini.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <h3 className="font-medium text-yellow-800 mb-2">Catatan:</h3>
                        <p className="text-sm text-yellow-700">
                            Rekomendasi ini berdasarkan prakiraan cuaca untuk 5 hari ke depan.
                            Untuk hasil terbaik, pertimbangkan juga faktor lain seperti jenis tanah,
                            drainase, dan ketersediaan cahaya matahari di lokasi penanaman Anda.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}