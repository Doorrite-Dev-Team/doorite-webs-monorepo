import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  typedRoutes: true,
  typedEnv: true,
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.ufs.sh",
      pathname: "/f/*",
    },
  ],
};

export default nextConfig;
