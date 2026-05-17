/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Next.js Image to load images from these domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS image sources
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  // Compress responses for faster page loads
  compress: true,

  // Power the app with modern output
  output: "standalone",

  // Reduce excessive worker concurrency during build to prevent DB connection pool exhaustion
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // Security headers for production hardening
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
