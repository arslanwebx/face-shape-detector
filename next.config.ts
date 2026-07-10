import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/face-shape-detector/",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
