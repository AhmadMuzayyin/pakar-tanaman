import React from "react";

// Komponen untuk step item
const StepItem = ({ number, title, description }: { number: number, title: string, description: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl mb-4">
                {number}
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
            <p className="text-gray-600 text-center">
                {description}
            </p>
        </div>
    );
};

export default function HowItWorksSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Sistem pakar tanaman kami menggunakan data dan algoritma untuk memberikan rekomendasi terbaik
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepItem
                        number={1}
                        title="Masukkan Lokasi"
                        description="Sistem mengambil data lokasi Anda untuk mendapatkan informasi cuaca terkini dan perkiraan."
                    />

                    <StepItem
                        number={2}
                        title="Analisis Data"
                        description="Sistem menganalisis data cuaca dan membandingkannya dengan kebutuhan optimal tanaman."
                    />

                    <StepItem
                        number={3}
                        title="Dapatkan Rekomendasi"
                        description="Anda menerima rekomendasi tanaman yang paling cocok untuk ditanam di lokasi Anda."
                    />
                </div>
            </div>
        </section>
    );
}