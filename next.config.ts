import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-markdown 10+ ships ESM but its deps include some CJS modules.
  // Turbopack needs them transpiled to play nicely in the server bundle.
  transpilePackages: ["react-markdown"],
};

export default nextConfig;
