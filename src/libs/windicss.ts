export const fonts = {
  emoji: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
  sans: ['Inter', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}

export const transitions = {
  border: 'border-color, box-shadow',
  visible: 'opacity, visibility',
}

export const plugins = [
  require('windicss/plugin/aspect-ratio'),
  require('@windicss/plugin-animations'),
]
