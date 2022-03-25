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
  ripple: 'ripple 2s linear infinite',
  fade: 'fade 0.2s ease',
}

export const keyframes = {
  ripple: {
    '0%': {
      width: 'var(--size-from)',
      height: 'var(--size-from)',
      opacity: 'calc(1 - var(--from))',
    },
    '100%': {
      width: 'var(--size-to)',
      height: 'var(--size-to)',
      opacity: 'calc(1 - var(--to))',
    },
  },
  fade: {
    '0%': { opacity: '0', transform: 'scale(0.96)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
}

export const safelist = []

export const plugins = [require('windicss/plugin/aspect-ratio')]
