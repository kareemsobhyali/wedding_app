/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["database"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  }
};

export default nextConfig;
