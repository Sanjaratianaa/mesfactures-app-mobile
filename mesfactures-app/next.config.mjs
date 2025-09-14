/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  // ACTIVER PWA même en développement
  disable: false, // ← Changé !
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
})

const finalConfig = {
  ...nextConfig,
  // DÉSACTIVER export pour le développement
  output: 'export', // ← Complètement commenté
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Configuration CSP permissive pour dev
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*; img-src 'self' data: blob:;"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          },
        ],
      },
    ]
  },

  // GARDER les console.log en développement
  compiler: {
    removeConsole: false // ← Complètement désactivé en dev
  }
}

export default finalConfig