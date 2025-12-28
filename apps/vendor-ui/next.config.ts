import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // Use ** to catch all subdomains like cnfvawbx16
        pathname: "/f/**", // Use ** for recursive paths if needed
      },
    ],
  },
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
};

export default nextConfig;
