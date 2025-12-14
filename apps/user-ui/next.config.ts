import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const withMDX = createMdx({
  extension: /\.mdx?$/, // Include both .md and .mdx
  options: {},
});

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    typedEnv: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
