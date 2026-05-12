import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Exclude functions directory from type checking
    tsconfigPath: "./tsconfig.json",
  },
  // Allow static generation time for pages
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
