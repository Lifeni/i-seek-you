export const fonts = {
  emoji: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
  sans: ['Inter', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}

export const transitions = {
  border: 'border-color, box-shadow',
  visible: 'opacity, visibility',
}

export const animations = {
  fade: 'fade 0.2s ease',
}

export const keyframes = {
  fade: {
    '0%': { opacity: '0', transform: 'scale(0.96)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
}

export const safelist = []

export const plugins = [
  require('windicss/plugin/aspect-ratio'),
  require('@windicss/plugin-animations'),
]
