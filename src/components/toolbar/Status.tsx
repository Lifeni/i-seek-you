interface StatusProps {
  type?: 'success' | 'error' | 'warning' | 'loading'
}

const BackgroundMap = {
  success: 'bg-green-600 dark:bg-green-500',
  error: 'bg-red-600 dark:bg-red-500',
  warning: 'bg-orange-600 dark:bg-orange-500',
  loading: 'bg-gray-600 dark:bg-gray-400',
}

const ColorMap = {
  success: 'text-secondary hover:text-primary',
  error: 'text-red-600 dark:text-red-500 font-bold',
  warning: 'text-orange-500 dark:text-orange-500 font-bold',
  loading: 'text-secondary hover:text-primary',
}

const SignalMap = {
  success: 'i-ic-round-signal-wifi-4-bar',
  error: 'i-ic-round-signal-wifi-bad',
  warning: 'i-ic-round-signal-wifi-1-bar',
  loading: 'i-ic-round-signal-wifi-4-bar',
}

const TextMap = {
  success: 'Connected',
  error: 'Lost Connection',
  warning: 'Slow Connection',
  loading: 'Connecting ...',
}

const Status = ({ type = 'loading' }: StatusProps) => (
  <div display="flex" items="center" justify="start" flex="1">
    <span
      class={`${BackgroundMap[type]} ${SignalMap[type]}`}
      w="6"
      h="6"
      rounded="full"
    />
    <span
      class={`${ColorMap[type]}`}
      mx="4"
      cursor="default"
      select="none"
      transition="color"
    >
      {TextMap[type]}
    </span>
  </div>
)

export { Status }
