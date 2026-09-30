const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@designcodeio/threeui/style.css'] = path.resolve(__dirname, 'src/shaders/threeui.css');
    config.resolve.alias['@designcodeio/threeui'] = path.resolve(__dirname, 'src/shaders/index.ts');
    return config;
  },
};

module.exports = nextConfig;
