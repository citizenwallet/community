/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_PATH
      : undefined,
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_ASSET_PATH
      : undefined,
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/",
          destination: process.env.NEXT_PUBLIC_BASE_PATH,
          basePath: false,
          permanent: false,
        },
      ];
    }
    return [];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    // Exclude .community directory from being bundled into the serverless function
    config.externals.push(/\.community/);
    config.externals.push(/\scripts/);

    return config;
  },
};

export default nextConfig;
