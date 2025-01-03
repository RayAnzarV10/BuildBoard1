import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: [
//       'uploadthing.com',
//       'utfs.io',
//       'img.clerk.com',
//       'subdomain',
//       'files.stripe.com',
//     ],
//   },
//   reactStrictMode: false,
// };

// module.exports = nextConfig;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'subdomain',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;