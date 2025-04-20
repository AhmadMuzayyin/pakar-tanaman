import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import type { Metadata, Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Konfigurasi metadata untuk SEO
export const metadata: Metadata = {
  title: {
    default: "TaniPintar - Aplikasi Pakar Tanaman",
    template: "%s | TaniPintar",
  },
  description: "Aplikasi untuk membantu petani dalam merawat tanaman dan mendapatkan rekomendasi terbaik",
  keywords: ["tanaman", "pertanian", "kebun", "tanipintar", "pakar tanaman", "rekomendasi tanaman"],
  authors: [{ name: "TaniPintar Team" }],
  creator: "TaniPintar",
};

// Konfigurasi viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
