/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Change to your actual production protocol and hostname (e.g., 'your-api.com')
        protocol: "http",
        hostname: "10.10.7.51", // ⚠️ REMEMBER TO CHANGE THIS IP to your DOMAIN in production!
        port: "8001", // Include the port if your image URLs use it (e.g., http://10.10.7.51:8001/media/...)
        pathname: "/**", // Allows any path on this domain/port
      },
    ],
  },
};

export default nextConfig;
