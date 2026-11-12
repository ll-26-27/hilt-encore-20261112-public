import path from "node:path";
import type { NextConfig } from "next";

const appRoot = process.cwd();
const repoRoot = path.dirname(appRoot);

// The site's words are in the repo's root content/, beside nextjs/ (CX writes them). The app reads content/ at
// request time, so new Markdown shows on reload; the tracing include brings content/ along when the app is deployed.
const config: NextConfig = {
  // The talk is screen-shared from the dev server: no Next badge in the corner.
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/*": ["../content/**/*"],
  },
};

export default config;
