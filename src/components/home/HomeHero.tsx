import Link from "next/link";

export default function HomeHero() {
    return (
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
    );
}