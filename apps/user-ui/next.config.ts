import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    typedEnv: true,
  },
};

export default nextConfig;
