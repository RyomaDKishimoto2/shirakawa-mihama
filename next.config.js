/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ビルド後のファイルを生成するディレクトリを指定
  distDir: 'out',
  // デフォルトの設定
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
