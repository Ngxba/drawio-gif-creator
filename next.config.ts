import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // API route configuration
  experimental: {
    // Increase body size limit for file uploads (50MB)
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // Optimize images (if needed)
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
