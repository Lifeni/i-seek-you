export const fonts = {
  emoji: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
  sans: ['Inter', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}

export const transitions = {
  border: 'border-color, box-shadow',
  visible: 'opacity, transform, visibility',
}

export const animations = {
  ripple: 'ripple 2s linear infinite',
}

export const keyframes = {
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
}
