import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Exclude functions directory from type checking
    tsconfigPath: "./tsconfig.json",
  },
  // Skip static generation for special pages
  staticPageGenerationTimeout: 0,
};

export default nextConfig;
