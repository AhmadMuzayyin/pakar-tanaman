import Link from "next/link";

export default function CTASection() {
    return (
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
    );
}