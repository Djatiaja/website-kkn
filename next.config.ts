import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Allow images from deployment domain + any subdomain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tanjungsari.windusari.web.id",
      },
    ],
  },
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default withNextIntl(nextConfig);
