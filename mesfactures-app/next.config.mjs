/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
})

const finalConfig = {
  ...nextConfig,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default finalConfig
