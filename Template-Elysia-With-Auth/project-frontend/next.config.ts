import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // SEO power-ups:
  compress: true,
  poweredByHeader: false, // rimuove X-Powered-By, security + clean
  
  images: {
    formats: ['image/avif', 'image/webp'], // immagini ottimizzate auto
    
  },
};

export default nextConfig;