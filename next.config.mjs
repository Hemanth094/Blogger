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
};

export default nextConfig;
