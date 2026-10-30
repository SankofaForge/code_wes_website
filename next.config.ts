import type { NextConfig } from 'next';

// A static export, so the board can host it on GitHub Pages or Vercel. Images are pre-sized
// WebP files in public/, so Next's image optimizer is not needed.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
