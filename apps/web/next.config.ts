import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@statuspass/ui",
    "@statuspass/compliance",
    "@statuspass/db",
  ],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
