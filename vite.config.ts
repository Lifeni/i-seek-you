import { defineConfig } from 'vite'
import SolidPlugin from 'vite-plugin-solid'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [SolidPlugin(), WindiCSS()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
})
