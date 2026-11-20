import type { NextConfig } from "next";

const isPagesBuild = process.env.PAGES_BUILD === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPagesBuild ? { output: "export" as const, basePath, assetPrefix: basePath, trailingSlash: true } : {}),
  images: { unoptimized: isPagesBuild },
  ...(!isPagesBuild ? {
    headers: async () => [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ],
  } : {}),
};

export default nextConfig;
