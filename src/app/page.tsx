import Link from "next/link";
import { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import FeatureSection from "@/components/home/FeatureSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/Footer";

// Metadata khusus untuk halaman beranda
export const metadata: Metadata = {
  title: "Beranda - Sistem Pakar Tanaman untuk Pertanian Berkelanjutan",
  description: "TaniPintar - Dapatkan rekomendasi tanaman terbaik berdasarkan kondisi cuaca dan lokasi Anda untuk hasil panen yang optimal.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HomeHero />

      {/* Features Section */}
      <FeatureSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
