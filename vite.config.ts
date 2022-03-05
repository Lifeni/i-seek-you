import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import UnoCss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCss({
      theme: { fontFamily: { sans: ['Inter', 'sans-serif'] } },
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
