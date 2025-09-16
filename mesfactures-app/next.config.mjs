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
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Remove the webpack configuration and replace with this:
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true, // Add this line
      layers: true, // Add this line
    }
    
    // Add rule for wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })
    
    // Add this to handle the jeep-sqlite package
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false,
      path: false,
    }
    
    return config
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
                  script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net;
                  worker-src 'self' blob:;
                  style-src 'self' 'unsafe-inline';
                  connect-src 'self' data: http://localhost:* ws://localhost:* wss://localhost:* https://projet-transversal-api.onrender.com;
                  img-src 'self' data: blob:;
                `.replace(/\s{2,}/g, ' ')
                : `
                  default-src 'self';
                  script-src 'self' 'unsafe-inline' blob: https://cdn.jsdelivr.net;
                  worker-src 'self' blob:;
                  style-src 'self' 'unsafe-inline';
                  connect-src 'self' https://cdn.jsdelivr.net https://projet-transversal-api.onrender.com;
                  img-src 'self' data: blob:;
                `.replace(/\s{2,}/g, ' '),

          },
        ],
      },
      // Add specific headers for WASM files
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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