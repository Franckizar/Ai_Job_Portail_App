import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
    ],
  },
  // Allow all origins in development (not recommended for production)
  allowedDevOrigins: [
  '192.168.100.9',      // Specific IP
  '192.168.100.*',      // Subnet with wildcard
  '192.168.*.*',        // Broader subnet
  'localhost',          // Hostname
  '*.local',
],

};

export default nextConfig;
