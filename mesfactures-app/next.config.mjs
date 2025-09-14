/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
})

const finalConfig = {
  ...nextConfig,
  // DÉSACTIVER export pour le développement
  // output: 'export', // ← Complètement commenté
  output: 'export', // ← Complètement commenté
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'development'
                ? `
                  default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
                  script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
                  worker-src 'self' blob:;
                  style-src 'self' 'unsafe-inline';
                  connect-src 'self' data: http://localhost:* ws://localhost:* wss://localhost:*;
                  img-src 'self' data: blob:;
                `.replace(/\s{2,}/g, ' ')
                : `
                  default-src 'self';
                  script-src 'self' 'unsafe-inline';
                  worker-src 'self';
                  style-src 'self' 'unsafe-inline';
                `.replace(/\s{2,}/g, ' '),
          },
        ],
      },
    ]
  },

  compiler: {
    removeConsole: false,
  },
}

export default finalConfig
