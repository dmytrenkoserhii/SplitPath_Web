import type { NextConfig } from 'next';

// TODO: check if next caching is working if we want to use it
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
