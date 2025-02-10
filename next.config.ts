import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //   domains: ["res.cloudinary.com"], 
  // },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", 
      },
    ],
  },
};

export default nextConfig;
