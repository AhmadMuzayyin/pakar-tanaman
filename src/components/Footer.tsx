import Link from "next/link";

export default function Footer() {
    return (
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
    );
}