import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const withMDX = createMdx({
  extension: /\.mdx?$/, // Include both .md and .mdx
  options: {},
});

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    typedEnv: false,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
