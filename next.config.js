/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  basePath: "/anu-unicode-converter",
  assetPrefix: "/anu-unicode-converter/",
};

module.exports = nextConfig;
