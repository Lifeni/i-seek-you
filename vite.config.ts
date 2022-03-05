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
      theme: {
        extend: {
          width: { fit: 'fit-content' },
        },
        fontFamily: { sans: ['Inter', 'sans-serif'] },
      },
      shortcuts: {
        'display-center': 'flex flex-col items-center justify-center',
        'display-screen': 'w-screen h-screen',
        'text-link':
          'w-fit text-blue-500 dark:text-blue-400 no-underline hover:underline',
        'text-primary': 'text-black dark:text-light-800 font-sans',
        'bg-primary': 'bg-white dark:bg-dark-800',
      },
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
