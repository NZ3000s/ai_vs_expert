import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lwcStandalone = path.join(
  process.cwd(),
  "node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.mjs"
);

const lwcStandaloneProjectRelative =
  "node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.mjs";

const nextConfig: NextConfig = {
  /** Avoid picking parent workspace lockfile when nested under another Next project. */
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ["lightweight-charts"],
  experimental: {
    devtoolSegmentExplorer: false,
  },
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
