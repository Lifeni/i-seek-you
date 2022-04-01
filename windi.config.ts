import { defineConfig } from 'windicss/helpers'
import { fonts, plugins, transitions } from './src/libs/windicss'

export default defineConfig({
  darkMode: 'media',
  attributify: true,
  theme: {
    fontFamily: { sans: fonts.sans, mono: fonts.mono },
    extend: {
      fontFamily: { emoji: fonts.emoji },
      transitionProperty: transitions,
    },
  },
  plugins: plugins,
})
