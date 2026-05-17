import type { NextConfig } from "next";

const backendUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        ...(backendUrl.port ? { port: backendUrl.port } : {}),
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
