import type { NextConfig } from "next";
import path from "node:path";

// next-pwa is not wired in: it is stale on Next 15 App Router / Turbopack.
// public/sw.js + app/manifest.ts cover Add to Home Screen / standalone.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: [
    "@statuspass/ui",
    "@statuspass/compliance",
    "@statuspass/db",
  ],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "x-vercel-skip-toolbar", value: "1" },
        ],
      },
    ];
  },
};

export default nextConfig;
