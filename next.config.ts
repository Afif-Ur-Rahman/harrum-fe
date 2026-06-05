import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    proxyClientMaxBodySize: "50mb",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "afif-personal.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "yallah-nshoof.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "invosq.s3.us-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
