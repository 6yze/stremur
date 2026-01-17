import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: export to allow server-side rendering via OpenNext
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" }
    ]
  }
};

export default nextConfig;
