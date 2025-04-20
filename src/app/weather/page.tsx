"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

type WeatherData = {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
};

export default function WeatherPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState({ lat: "", lon: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    // Function to get user's location
    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
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
                    setIsLocating(false);
                },
                (err) => {
                    console.error("Error getting location:", err);
                    setDetectedLocation("Gagal mendeteksi lokasi");
                    setError("Tidak dapat mendeteksi lokasi Anda. Silakan izinkan akses lokasi di browser Anda.");
                    setIsLocating(false);
                }
            );
        } else {
            setDetectedLocation("Geolokasi tidak didukung di browser Anda");
            setError("Geolokasi tidak didukung di browser Anda. Silakan gunakan browser lain yang mendukung geolokasi.");
        }
    };

    // Detect user's location on component mount
    useEffect(() => {
        getUserLocation();
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

    const fetchWeather = useCallback(async () => {
        if (!location.lat || !location.lon) {
            setError("Lokasi belum terdeteksi");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/weather/current`, {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                },
            });
            setWeather(response.data);
        } catch (error) {
            console.error("Failed to fetch weather data", error);
            setError("Gagal mendapatkan data cuaca. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, [location]);

    useEffect(() => {
        if (location.lat && location.lon) {
            fetchWeather();
        }
    }, [location, fetchWeather]);

    // Format timestamp to readable time
    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Get weather icon URL
    const getWeatherIconUrl = (iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    // Get wind direction as text
    const getWindDirection = (degrees: number) => {
        const directions = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];
        const index = Math.round(((degrees % 360) / 45)) % 8;
        return directions[index];
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Informasi Cuaca</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Lokasi Anda</h2>

                <div className="mb-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <p className="text-blue-700">
                                    {isLocating ? "Mendeteksi lokasi Anda..." : detectedLocation || "Lokasi belum terdeteksi"}
                                </p>
                            </div>
                            <button
                                onClick={getUserLocation}
                                disabled={isLocating}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Perbarui Lokasi
                            </button>
                        </div>

                        {location.lat && location.lon && (
                            <div className="mt-2 text-xs text-blue-600 flex justify-between">
                                <span>Koordinat: {location.lat}, {location.lon}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={fetchWeather}
                    disabled={loading || !location.lat || !location.lon}
                    className={`${loading || !location.lat || !location.lon ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        } text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center w-full`}
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
                        "Perbarui Data Cuaca"
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

            {weather && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{weather.name}{weather.sys?.country ? `, ${weather.sys.country}` : ""}</h2>
                                <p className="text-blue-100 mt-1">{new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center">
                                {weather.weather && weather.weather[0] && (
                                    <Image
                                        src={getWeatherIconUrl(weather.weather[0].icon)}
                                        alt={weather.weather[0].description}
                                        className="w-16 h-16"
                                        width={64}
                                        height={64}
                                    />
                                )}
                                <div className="ml-2">
                                    <div className="flex items-end">
                                        <span className="text-4xl font-bold">{Math.round(weather.main.temp)}</span>
                                        <span className="text-xl ml-1">°C</span>
                                    </div>
                                    <p className="capitalize text-blue-100">
                                        {weather.weather && weather.weather[0] ? weather.weather[0].description : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-blue-400 mb-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                </span>
                                <span className="text-sm text-gray-500">Terasa Seperti</span>
                                <span className="text-xl font-semibold">{Math.round(weather.main.feels_like)}°C</span>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-blue-400 mb-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                </span>
                                <span className="text-sm text-gray-500">Kelembaban</span>
                                <span className="text-xl font-semibold">{weather.main.humidity}%</span>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-blue-400 mb-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </span>
                                <span className="text-sm text-gray-500">Angin</span>
                                <span className="text-xl font-semibold">{weather.wind.speed} m/s</span>
                                <span className="text-xs text-gray-500">{getWindDirection(weather.wind.deg)}</span>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-blue-400 mb-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                    </svg>
                                </span>
                                <span className="text-sm text-gray-500">Terbit & Terbenam</span>
                                <div className="flex items-center justify-center space-x-2 text-sm">
                                    <span>{weather.sys && formatTime(weather.sys.sunrise)}</span>
                                    <span>-</span>
                                    <span>{weather.sys && formatTime(weather.sys.sunset)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Pertimbangan Penanaman
                                </h3>
                                <p className="text-sm text-yellow-700">
                                    {weather.main.temp < 15 ? (
                                        "Suhu saat ini cukup rendah. Pertimbangkan untuk menanam jenis tanaman yang tahan kondisi dingin."
                                    ) : weather.main.temp > 30 ? (
                                        "Suhu saat ini cukup tinggi. Pastikan tanaman mendapatkan kelembaban yang cukup dan terlindungi dari paparan sinar matahari langsung yang berlebihan."
                                    ) : (
                                        "Kondisi cuaca saat ini cukup ideal untuk berbagai jenis tanaman. Pastikan tanaman mendapatkan air yang cukup sesuai kebutuhannya."
                                    )}
                                </p>

                                <div className="mt-2">
                                    <a href="/recommendations" className="text-green-600 hover:text-green-800 text-sm underline">
                                        Dapatkan rekomendasi tanaman berdasarkan perkiraan cuaca
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}