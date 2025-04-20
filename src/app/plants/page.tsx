"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  userId?: number | null;
  isPublic: boolean;
};

export default function PlantsPage() {
  const { data: session, status } = useSession();
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
    isPublic: false, // Default to private plant
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlantId, setCurrentPlantId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
    setError(null);
    setActionLoading(true);

    // Check if user is logged in
    if (status !== "authenticated") {
      setError("Anda harus login untuk menambahkan tanaman");
      setActionLoading(false);
      return;
    }

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
      if (isEditMode && currentPlantId) {
        // Update existing plant
        const response = await axios.put(`/api/plants/${currentPlantId}`, plantData);
        setPlants(plants.map(plant => plant.id === currentPlantId ? response.data : plant));
      } else {
        // Create new plant
        const response = await axios.post("/api/plants", plantData);
        setPlants([...plants, response.data]);
      }

      // Reset form
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
        isPublic: false,
      });
      setIsFormVisible(false);
      setIsEditMode(false);
      setCurrentPlantId(null);
    } catch (error: any) {
      console.error("Error saving plant:", error);
      setError(error.response?.data?.error || "Gagal menyimpan data tanaman");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (plant: Plant) => {
    setForm({
      name: plant.name,
      type: plant.type,
      growingPeriod: plant.growingPeriod.toString(),
      tempMin: plant.tempMin.toString(),
      tempMax: plant.tempMax.toString(),
      humidityMin: plant.humidityMin.toString(),
      humidityMax: plant.humidityMax.toString(),
      rainResistance: plant.rainResistance,
      idealSeason: plant.idealSeason,
      notes: plant.notes || "",
      isPublic: plant.isPublic,
    });
    setIsEditMode(true);
    setCurrentPlantId(plant.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (plantId: number) => {
    setPlantToDelete(plantId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!plantToDelete) return;

    setActionLoading(true);
    try {
      await axios.delete(`/api/plants/${plantToDelete}`);
      setPlants(plants.filter(plant => plant.id !== plantToDelete));
      setIsDeleteModalOpen(false);
      setPlantToDelete(null);
    } catch (error: any) {
      console.error("Error deleting plant:", error);
      setError(error.response?.data?.error || "Gagal menghapus tanaman");
    } finally {
      setActionLoading(false);
    }
  };

  // Check if plant belongs to current user
  const isUserPlant = (plant: Plant) => {
    return plant.userId && session?.user?.id && plant.userId === parseInt(session.user.id as string);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Tanaman</h1>
        {status === "authenticated" ? (
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              if (!isFormVisible) {
                // Reset form when opening to add a new plant
                setIsEditMode(false);
                setCurrentPlantId(null);
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
                  isPublic: false,
                });
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isFormVisible ? "Tutup Form" : "Tambah Tanaman"}
          </button>
        ) : (
          <></>
        )}
      </div>

      {status !== "authenticated" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Untuk menambahkan tanaman baru, Anda perlu <Link href="/login" className="font-medium underline">login</Link> atau{" "}
                <Link href="/register" className="font-medium underline">mendaftar</Link> terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      )}

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

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditMode ? "Edit Tanaman" : "Tambah Tanaman Baru"}
          </h2>
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
              <div className="flex items-center mb-4">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                  Tampilkan tanaman ini untuk semua pengguna (publik)
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={actionLoading}
                className={`${actionLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  } text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center`}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  isEditMode ? "Update Tanaman" : "Simpan Tanaman"
                )}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setCurrentPlantId(null);
                    setIsFormVisible(false);
                  }}
                  className="ml-3 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Batal
                </button>
              )}
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
                <div
                  key={plant.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ${isUserPlant(plant) ? 'ring-2 ring-green-500' : ''
                    }`}
                >
                  <div className={`p-4 border-b border-gray-200 flex justify-between items-center ${isUserPlant(plant) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">{plant.name}</h3>
                      <p className="text-sm text-green-600">{plant.type}</p>
                    </div>
                    <div className="flex items-center">
                      {isUserPlant(plant) && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                          Tanaman Anda
                        </span>
                      )}
                      {!isUserPlant(plant) && plant.isPublic && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">
                          Publik
                        </span>
                      )}

                      {/* Edit and Delete buttons only for user's plants */}
                      {isUserPlant(plant) && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(plant)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(plant.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Konfirmasi Hapus Tanaman</h3>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus tanaman ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                disabled={actionLoading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className={`${actionLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                  } text-white px-4 py-2 rounded-lg transition-colors flex items-center`}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  "Hapus Tanaman"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}