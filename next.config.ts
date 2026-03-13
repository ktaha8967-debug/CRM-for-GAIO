import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ["103.6.169.235", "http://103.6.169.235", "https://103.6.169.235"],
  },
};

export default nextConfig;
