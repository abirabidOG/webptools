import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/webptools",
        destination: "/",
        permanent: true,
      },
      {
        source: "/WEBPTools",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webp-tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
