import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'
import presetWind from '@unocss/preset-wind'
import transformerDirective from '@unocss/transformer-directives'
import UnoCss from 'unocss/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { shortcuts, theme } from './src/libs/styles'

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCss({
      presets: [presetUno(), presetWind(), presetAttributify(), presetIcons()],
      transformers: [transformerDirective()],
      theme: theme,
      shortcuts: shortcuts,
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
