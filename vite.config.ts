import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import SolidPlugin from 'vite-plugin-solid'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    SolidPlugin(),
    WindiCSS(),
    VitePWA({
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'I Seek You',
        short_name: 'I Seek You',
        description: 'A WebRTC-based cross-platform data transfer application.',
        theme_color: '#f36161',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
})
