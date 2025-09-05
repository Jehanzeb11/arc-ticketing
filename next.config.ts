import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1", "192.168.10.40"],
  },
  env: {
    LIVE_BASE_URL: process.env.LIVE_BASE_URL,
    LOCAL_BASE_URL: process.env.LOCAL_BASE_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.LOCAL_BASE_URL}/:path*`, // Proxy to local API
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Adding experimental configuration for better MUI compatibility
  experimental: {
    esmExternals: "loose", // This can help with MUI import issues
  },
};

export default nextConfig;
