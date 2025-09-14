/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Next exports static files when output: "export"
  output: "export",

  // Disable next/image optimization for static export
  images: { unoptimized: true },

  // Keep trailing slashes to match exported layout
  trailingSlash: true,

  // Skip ESLint during CI builds if desired
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Only apply these when building for production (GitHub Pages under /portfolio)
  ...(isProd
    ? {
        basePath: "/portfolio",
        assetPrefix: "/portfolio",
      }
    : {}),
};

module.exports = nextConfig;