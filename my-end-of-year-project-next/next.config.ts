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
  allowedDevOrigins: ["*"],
};

export default nextConfig;
