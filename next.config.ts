import type { NextConfig } from "next";
import path from "path";

/** Standalone build: use only on the client bundle to avoid server chunk graph issues. */
const lwcStandalone = path.join(
  process.cwd(),
  "node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.mjs"
);

/**
 * Turbopack cannot use absolute paths in `resolveAlias` (it wrongly prefixes `./`).
 * Project-relative path only — same file as `lwcStandalone`.
 */
const lwcStandaloneProjectRelative =
  "node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.mjs";

const nextConfig: NextConfig = {
  transpilePackages: ["lightweight-charts"],
  /**
   * Disables the App Router “segment explorer” in dev. When enabled it can
   * trigger RSC manifest errors (“SegmentViewNode” / hot reload 500s), especially
   * with paths that contain spaces. See next.config experimental.devtoolSegmentExplorer.
   */
  experimental: {
    devtoolSegmentExplorer: false,
  },
  /** Dev (`next dev --turbo`): same alias as webpack client bundle. */
  turbopack: {
    resolveAlias: {
      "lightweight-charts": lwcStandaloneProjectRelative,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias as Record<string, string | false | string[]>),
        "lightweight-charts": lwcStandalone,
      };
    }
    return config;
  },
};

export default nextConfig;
