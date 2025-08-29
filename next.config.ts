import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    LIVE_BASE_URL: process.env.LIVE_BASE_URL,
    LOCAL_BASE_URL: process.env.LOCAL_BASE_URL,
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
