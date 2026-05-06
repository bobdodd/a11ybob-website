import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-markdown 10+ ships ESM but its deps include some CJS modules.
  // Turbopack needs them transpiled to play nicely in the server bundle.
  transpilePackages: ["react-markdown"],
  // Hide the dev-mode route/bundler indicator — it's noise during
  // visual review of pages. Build/runtime errors still surface
  // through the regular Next overlay.
  devIndicators: false,
};

export default nextConfig;
