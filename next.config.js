/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Render.com でのビルド時に必要な設定
  target: 'serverless',
  // ビルド後のファイルを生成するディレクトリを指定
  distDir: 'build',
  // デフォルトの設定
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
