import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    TZ: 'America/Guayaquil', // GMT-5 (Ecuador - Quito)
  },
};

export default nextConfig;
