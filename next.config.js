/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // 允许加载 localhost 的图片
  },
}

module.exports = nextConfig 