/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        domains: ['openweathermap.org'],
    },
    // Mengaktifkan output standalone untuk optimasi deployment
    output: 'standalone',
    // Mengaktifkan revalidasi cache web untuk meningkatkan performa
    reactStrictMode: true,
    // Konfigurasi eksperimental
    experimental: {
        // Mengoptimalkan bundling dengan meningkatkan kecepatan build dan performa runtime
        optimizeCss: true,
        // Mengaktifkan fitur server actions untuk App Router
        serverActions: true,
    },
    // Konfigurasi webpack tambahan untuk optimasi
    webpack: (config, { dev, isServer }) => {
        // Optimasi build hanya pada production
        if (!dev && !isServer) {
            // Mengaktifkan tree shaking tambahan
            config.optimization.minimize = true;
        }
        return config;
    },
};

module.exports = nextConfig;