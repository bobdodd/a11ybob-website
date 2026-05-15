import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-markdown 10+ ships ESM but its deps include some CJS modules.
  // Turbopack needs them transpiled to play nicely in the server bundle.
  transpilePackages: ["react-markdown"],
  // Hide the dev-mode route/bundler indicator — it's noise during
  // visual review of pages. Build/runtime errors still surface
  // through the regular Next overlay.
  devIndicators: false,
  // The Paradise playground moved from /playground to
  // /playgrounds/paradise when the Playgrounds parent nav was
  // introduced. The redirect preserves any inbound link to the
  // old URL. Permanent (308) so search engines update.
  async redirects() {
    return [
      {
        source: "/playground",
        destination: "/playgrounds/paradise",
        permanent: true,
      },
      {
        source: "/playground/:path*",
        destination: "/playgrounds/paradise/:path*",
        permanent: true,
      },
      // The Action Language playground moved out of /research and
      // into /playgrounds/action-language alongside the Paradise
      // playground. Same reason: it's a playground, not research
      // content. Inbound links continue to resolve via 308.
      {
        source: "/research/action-language",
        destination: "/playgrounds/action-language",
        permanent: true,
      },
      {
        source: "/research/action-language/:path*",
        destination: "/playgrounds/action-language/:path*",
        permanent: true,
      },
      // The research model page was originally slugged
      // /research/carnforth-model — the name conflated the model
      // (CISNA) with the tool family (Carnforth). The model has its
      // correct slug now; the old one continues to resolve via 308.
      {
        source: "/research/carnforth-model",
        destination: "/research/cisna-model",
        permanent: true,
      },
      {
        source: "/research/carnforth-model/:path*",
        destination: "/research/cisna-model/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
