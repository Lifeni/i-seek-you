import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'
import UnoCss from 'unocss/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { shortcuts, theme } from './styles'

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCss({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      theme: theme,
      shortcuts: shortcuts,
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
