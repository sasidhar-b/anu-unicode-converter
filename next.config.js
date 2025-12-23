/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // IMPORTANT:
  // 1) Set basePath to your repo name (e.g. '/anu-unicode-converter')
  // 2) Set assetPrefix to the same value
  // If you deploy to https://<user>.github.io/<repo>/
  // Uncomment and edit:
  basePath: '/anu-unicode-converter',
  assetPrefix: '/anu-unicode-converter/',
  trailingSlash: true,
};

export default nextConfig;
