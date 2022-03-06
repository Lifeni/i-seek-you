export const shortcuts = {
  // base
  'display-screen': 'w-screen h-screen bg-primary font-sans text-primary',
  'display-base': 'bg-primary font-sans text-primary',

  // flex
  'flex-start': 'flex items-center justify-start',
  'flex-center': 'flex items-center justify-center',
  'flex-end': 'flex items-center justify-end',
  'flex-between': 'flex items-center justify-between',

  // text
  'text-primary': 'text-black dark:text-gray-200',
  'text-secondary': 'text-gray-600 dark:text-gray-400',
  'text-link': 'w-fit text-rose-500 no-underline hover:underline',
  'text-none': 'select-none leading-none',

  // background
  'bg-primary': 'bg-white dark:bg-dark-400',
  'bg-secondary': 'bg-light-400 dark:bg-dark-600',

  // input
  'border-input': 'border-1 border-light-800 dark:border-dark-800',
  'ring-input':
    'outline-none ring-4 ring-rose-500 ring-opacity-75 transition-shadow',

  // icon
  'icon-base': 'w-6 h-6 rounded-full transition-colors',
  'icon-button':
    'w-6 h-6 rounded-full cursor-pointer transition-colors text-secondary hover:(text-black dark:text-gray-200)',
}

export const theme = {
  extend: {
    width: { fit: 'fit-content' },
  },
  fontFamily: {
    sans: ['Inter', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
}
