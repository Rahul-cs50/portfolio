const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignore lint errors on build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ignore TypeScript errors on build
  },
};

module.exports = nextConfig;
