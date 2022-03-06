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

  // border
  'border-input':
    'border-1 border-light-800 dark:border-dark-200 hover:border-rose-500',
  'ring-input':
    'outline-none ring-4 ring-rose-500 ring-opacity-75 transition-shadow',

  // icon
  'icon-base': 'flex w-6 h-6 rounded-full transition-colors',
  'icon-button':
    'flex w-6 h-6 rounded-full cursor-pointer transition-colors text-secondary hover:(text-black dark:text-gray-200)',

  // tooltip
  tooltip: `before:(absolute left-1/2 top-full transform -translate-x-1/2 
            px-3 py-1.5 rounded text-black dark:text-gray-200 bg-white dark:bg-dark-400 text-sm 
            border-1 border-light-800 dark:border-dark-200 opacity-0 invisible transition shadow-lg 
            translate-y-2 cursor-default pointer-events-none whitespace-nowrap font-normal) 
            hover:before:(opacity-100 visible) relative`,
  'tooltip-left': `before:(left-0 -translate-x-4)`,
  'tooltip-right': `before:(left-auto right-0 translate-x-4)`,
  'tooltip-top': `before:(top-auto bottom-full -translate-y-2)`,
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
