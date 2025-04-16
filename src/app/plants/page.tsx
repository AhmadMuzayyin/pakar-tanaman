"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Plant = {
  id: number;
  name: string;
  type: string;
  growingPeriod: number;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  rainResistance: string;
  idealSeason: string;
  notes?: string;
};

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    type: "",
    growingPeriod: "",
    tempMin: "",
    tempMax: "",
    humidityMin: "",
    humidityMax: "",
    rainResistance: "",
    idealSeason: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get("/api/plants");
        setPlants(response.data);
        setFilteredPlants(response.data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    const filtered = plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlants(filtered);
  }, [searchTerm, plants]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert string values to numbers where needed
    const plantData = {
      ...form,
      growingPeriod: parseInt(form.growingPeriod),
      tempMin: parseFloat(form.tempMin),
      tempMax: parseFloat(form.tempMax),
      humidityMin: parseFloat(form.humidityMin),
      humidityMax: parseFloat(form.humidityMax),
    };

    try {
      const response = await axios.post("/api/plants", plantData);
      setPlants([...plants, response.data]);
      setForm({
        name: "",
        type: "",
        growingPeriod: "",
        tempMin: "",
        tempMax: "",
        humidityMin: "",
        humidityMax: "",
        rainResistance: "",
        idealSeason: "",
        notes: "",
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Tanaman</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isFormVisible ? "Tutup Form" : "Tambah Tanaman"}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Tanaman Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tanaman</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tanaman</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode Tumbuh (hari)</label>
              <input
                type="number"
                value={form.growingPeriod}
                onChange={(e) => setForm({ ...form, growingPeriod: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suhu Minimum (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.tempMin}
                onChange={(e) => setForm({ ...form, tempMin: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suhu Maksimum (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.tempMax}
                onChange={(e) => setForm({ ...form, tempMax: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelembaban Minimum (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.humidityMin}
                onChange={(e) => setForm({ ...form, humidityMin: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelembaban Maksimum (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.humidityMax}
                onChange={(e) => setForm({ ...form, humidityMax: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ketahanan Hujan</label>
              <select
                value={form.rainResistance}
                onChange={(e) => setForm({ ...form, rainResistance: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Pilih ketahanan</option>
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Musim Ideal</label>
              <select
                value={form.idealSeason}
                onChange={(e) => setForm({ ...form, idealSeason: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Pilih musim</option>
                <option value="Hujan">Hujan</option>
                <option value="Kemarau">Kemarau</option>
                <option value="Semua">Semua</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border rounded-md p-2 w-full h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Simpan Tanaman
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari tanaman berdasarkan nama atau jenis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Memuat data tanaman...</p>
        </div>
      ) : (
        <>
          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <div key={plant.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-green-800">{plant.name}</h3>
                    <p className="text-sm text-green-600">{plant.type}</p>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                      <div className="text-gray-600">Periode Tumbuh:</div>
                      <div>{plant.growingPeriod} hari</div>

                      <div className="text-gray-600">Suhu:</div>
                      <div>{plant.tempMin}°C - {plant.tempMax}°C</div>

                      <div className="text-gray-600">Kelembaban:</div>
                      <div>{plant.humidityMin}% - {plant.humidityMax}%</div>

                      <div className="text-gray-600">Ketahanan Hujan:</div>
                      <div>{plant.rainResistance}</div>

                      <div className="text-gray-600">Musim Ideal:</div>
                      <div>{plant.idealSeason}</div>
                    </div>

                    {plant.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">{plant.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">Tidak ada tanaman yang ditemukan</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}