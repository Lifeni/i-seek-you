import { defineConfig } from 'windicss/helpers'

const fonts = {
  emoji: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
  sans: ['Inter', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}

const transitions = {
  border: 'border-color, box-shadow',
  visible: 'opacity, visibility',
}

const plugins = [
  require('windicss/plugin/aspect-ratio'),
  require('@windicss/plugin-animations'),
]

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
