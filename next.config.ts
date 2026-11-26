import type { NextConfig } from "next";

// Phase 1: static export. `next build` writes plain HTML/CSS/JS to `out/`,
// so the phone only has to serve files, never compile anything.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
