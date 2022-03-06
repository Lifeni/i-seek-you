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
        extend: { width: { fit: 'fit-content' } },
        fontFamily: { sans: ['Inter', 'sans-serif'] },
      },
      shortcuts: {
        'display-center': 'flex flex-col items-center justify-center',
        'display-screen': 'w-screen h-screen',
        'text-link':
          'w-fit text-rose-500 dark:text-rose-400 no-underline hover:underline',
        'text-primary': 'text-black dark:text-gray-200',
        'text-secondary': 'text-gray-600 dark:text-gray-400',
        'bg-primary': 'bg-white dark:bg-dark-400',
        'bg-secondary': 'bg-light-400 dark:bg-dark-600',
        'border-primary': 'border-1 border-light-800 dark:border-dark-800',
        'ring-auto':
          'outline-none ring-4 ring-rose-500 ring-opacity-75 transition-shadow',
      },
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
