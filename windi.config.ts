import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  attributify: true,
  theme: {
    fontFamily: {
      sans: ['Inter', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    extend: {
      fontFamily: {
        emoji: [
          'Segoe UI Emoji',
          'Apple Color Emoji',
          'Noto Color Emoji',
          'Segoe UI Symbol',
        ],
      },
      transitionProperty: { border: 'border-color, box-shadow' },
      animation: { ripple: 'ripple 2s linear infinite' },
      keyframes: {
        ripple: {
          '0%': {
            width: 'calc(max(100vh, 100vw) * var(--from))',
            height: 'calc(max(100vh, 100vw) * var(--from))',
            opacity: 'calc(1 - var(--from))',
          },
          '100%': {
            width: 'calc(max(100vh, 100vw) * var(--to))',
            height: 'calc(max(100vh, 100vw) * var(--to))',
            opacity: 'calc(1 - var(--to))',
          },
        },
      },
    },
  },
})
