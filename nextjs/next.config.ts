import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  turbopack: { root: path.dirname(process.cwd()) },
};

export default config;
