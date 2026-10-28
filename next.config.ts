import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Handbook PDFs moved behind /api/free-handbooks (earlier issues are for subscribers); old links keep working.
  async redirects() {
    return [{ source: "/downloads/pharmavault-:slug-handbook.pdf", destination: "/api/free-handbooks/:slug", permanent: false }];
  },
};

export default nextConfig;
