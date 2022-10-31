/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "pl"],
    defaultLocale: "en",
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
