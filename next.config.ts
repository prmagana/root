import type { NextConfig } from "next";

// Same shape as form; cacheComponents/partialPrefetching dropped since the adapter doesn't need them and the page is static.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
