/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["pino"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}

export default nextConfig
