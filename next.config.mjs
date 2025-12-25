/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cupid-ai-phi.vercel.app",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
