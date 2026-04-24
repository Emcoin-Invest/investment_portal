import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Exclude functions directory from type checking
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;