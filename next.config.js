/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["suoh-camping.s3.ap-northeast-2.amazonaws.com", "kamprite.com"], 
    },
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "https://suohtest.com/api/:path*",
        },
      ];
    },
}

module.exports = nextConfig
