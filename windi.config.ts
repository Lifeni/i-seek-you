import { defineConfig } from 'windicss/helpers'
import {
  animations,
  fonts,
  keyframes,
  safelist,
  transitions,
} from './src/libs/styles'

export default defineConfig({
  darkMode: 'media',
  attributify: true,
  theme: {
    fontFamily: { sans: fonts.sans, mono: fonts.mono },
    extend: {
      fontFamily: { emoji: fonts.emoji },
      transitionProperty: transitions,
      animation: animations,
      keyframes: { ripple: keyframes.ripple },
    },
  },
  safelist: safelist,
})
