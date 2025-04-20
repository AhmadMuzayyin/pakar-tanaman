import Link from "next/link";

// Komponen untuk Feature Card
const FeatureCard = ({
    title,
    description,
    icon,
    linkText,
    linkHref
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    linkText: string;
    linkHref: string;
}) => {
    return (
        <div className="bg-green-50 p-6 rounded-lg shadow-md transition-transform hover:scale-[1.02]">
            <div className="text-green-700 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">
                {description}
            </p>
            <div className="mt-4">
                <Link href={linkHref} className="text-green-600 hover:text-green-800 font-medium">
                    {linkText} →
                </Link>
            </div>
        </div>
    );
};

export default function FeatureSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Fitur Utama</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Optimalkan hasil pertanian Anda dengan data dan rekomendasi berbasis ilmu pengetahuan
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Rekomendasi Pintar"
                        description="Dapatkan rekomendasi tanaman berdasarkan data cuaca real-time dan perkiraan di lokasi Anda."
                        linkText="Coba Sekarang"
                        linkHref="/recommendations"
                        icon={
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        }
                    />

                    <FeatureCard
                        title="Database Tanaman"
                        description="Akses informasi lengkap tentang berbagai jenis tanaman beserta kebutuhan tumbuh optimalnya."
                        linkText="Lihat Tanaman"
                        linkHref="/plants"
                        icon={
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        }
                    />

                    <FeatureCard
                        title="Info Cuaca"
                        description="Pantau kondisi cuaca terkini di lokasi Anda dan dapatkan informasi yang relevan untuk pertanian."
                        linkText="Cek Cuaca"
                        linkHref="/weather"
                        icon={
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                            </svg>
                        }
                    />
                </div>
            </div>
        </section>
    );
}