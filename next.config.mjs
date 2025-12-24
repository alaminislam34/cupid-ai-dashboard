/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized true optional, but safer for external dev URLs
    unoptimized: true,

    // Optional: external URLs you want to allow in production
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cupid-ai-phi.vercel.app", // Replace with your actual domain
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
