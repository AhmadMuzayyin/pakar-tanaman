import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Sistem Pakar Tanaman untuk Pertanian Berkelanjutan
              </h1>
              <p className="text-xl text-green-100">
                Dapatkan rekomendasi tanaman terbaik berdasarkan kondisi cuaca dan lokasi Anda untuk hasil panen yang optimal.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/recommendations"
                  className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-100 transition-colors"
                >
                  Dapatkan Rekomendasi
                </Link>
                <Link
                  href="/plants"
                  className="bg-green-700 border border-white text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-900 transition-colors"
                >
                  Lihat Tanaman
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-lg h-80">
                {/* Placeholder for a plant illustration or photo */}
                <div className="absolute inset-0 bg-green-200 rounded-lg opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-40 h-40 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 0.31 0.049 0.608 0.138 0.887"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.879 16.121C9.289 15.531 9 14.766 9 14c0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.766-0.289 1.531-0.879 2.121"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Utama</h2>
            <p className="mt-4 text-lg text-gray-600">
              Optimalkan hasil pertanian Anda dengan data dan rekomendasi berbasis ilmu pengetahuan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="text-green-700 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rekomendasi Pintar</h3>
              <p className="text-gray-600">
                Dapatkan rekomendasi tanaman berdasarkan data cuaca real-time dan perkiraan di lokasi Anda.
              </p>
              <div className="mt-4">
                <Link href="/recommendations" className="text-green-600 hover:text-green-800 font-medium">
                  Coba Sekarang →
                </Link>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="text-green-700 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Tanaman</h3>
              <p className="text-gray-600">
                Akses informasi lengkap tentang berbagai jenis tanaman beserta kebutuhan tumbuh optimalnya.
              </p>
              <div className="mt-4">
                <Link href="/plants" className="text-green-600 hover:text-green-800 font-medium">
                  Lihat Tanaman →
                </Link>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="text-green-700 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Info Cuaca</h3>
              <p className="text-gray-600">
                Pantau kondisi cuaca terkini di lokasi Anda dan dapatkan informasi yang relevan untuk pertanian.
              </p>
              <div className="mt-4">
                <Link href="/weather" className="text-green-600 hover:text-green-800 font-medium">
                  Cek Cuaca →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
            <p className="mt-4 text-lg text-gray-600">
              Sistem pakar tanaman kami menggunakan data dan algoritma untuk memberikan rekomendasi terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Masukkan Lokasi</h3>
              <p className="text-gray-600 text-center">
                Sistem mengambil data lokasi Anda untuk mendapatkan informasi cuaca terkini dan perkiraan.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Analisis Data</h3>
              <p className="text-gray-600 text-center">
                Sistem menganalisis data cuaca dan membandingkannya dengan kebutuhan optimal tanaman.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Dapatkan Rekomendasi</h3>
              <p className="text-gray-600 text-center">
                Anda menerima rekomendasi tanaman yang paling cocok untuk ditanam di lokasi Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Mulai Optimalkan Pertanian Anda</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Gunakan sistem pakar tanaman kami untuk mendapatkan rekomendasi tanaman yang tepat
            sesuai dengan kondisi lingkungan Anda.
          </p>
          <Link
            href="/recommendations"
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-100 transition-colors inline-block"
          >
            Dapatkan Rekomendasi Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">TaniPintar</h3>
              <p className="text-gray-400">Sistem Pakar Tanaman untuk Pertanian Berkelanjutan</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/plants" className="hover:text-green-400">
                Tanaman
              </Link>
              <Link href="/recommendations" className="hover:text-green-400">
                Rekomendasi
              </Link>
              <Link href="/weather" className="hover:text-green-400">
                Cuaca
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} TaniPintar. Dibuat dengan teknologi modern untuk petani Indonesia.
          </div>
        </div>
      </footer>
    </div>
  );
}
