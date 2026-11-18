import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medias.house.dandela.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
