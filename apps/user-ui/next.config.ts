import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: false,
    typedEnv: true,
  },
};

export default nextConfig;
