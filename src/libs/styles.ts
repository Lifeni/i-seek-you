export const shortcuts = {
  center: `left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`,
  screen: `w-screen h-screen overflow-hidden`,

  hide: `opacity-0 invisible transition`,
  show: `opacity-100 visible transition`,

  button: `text-inherit font-sans border-none cursor-pointer`,
  input: `bg-transparent text-inherit border-main hover:border-rose-500 font-sans`,

  'flex-start': `flex items-center justify-start`,
  'flex-center': `flex items-center justify-center`,
  'flex-end': `flex items-center justify-end`,
  'flex-between': `flex items-center justify-between`,

  'text-main': `text-black dark:text-gray-200`,
  'text-light': `text-gray-600 dark:text-gray-400`,
  'text-link': `w-fit text-rose-500 dark:text-rose-500 no-underline hover:underline`,

  'bg-main': `bg-white dark:bg-dark-400`,
  'bg-dark': `bg-light-400 dark:bg-dark-600`,

  'border-main': `border-1 border-light-800 dark:border-dark-200`,
  'ring-main': `outline-none ring-4 ring-rose-500 ring-opacity-75 transition-shadow`,
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
