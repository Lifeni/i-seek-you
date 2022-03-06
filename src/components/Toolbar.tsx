import { createSignal } from 'solid-js'

type StatusType = 'success' | 'error' | 'warning' | 'loading'

export const Toolbar = () => {
  const [status, setStatus] = createSignal<StatusType>('loading')
  const iconStyle = () => `${BackgroundMap[status()]} ${SignalMap[status()]}`

  return (
    <header w="full" flex="between" px="12" py="6" gap="8">
      <div flex="start 1">
        <span class={`${iconStyle()} icon-base`} />
      </div>
      <h1 text="xl center none" flex="1">
        I Seek You
      </h1>
      <div flex="end 1">
        <button class="i-ic-round-settings icon-button">Settings</button>
      </div>
    </header>
  )
}

const BackgroundMap = {
  success: 'bg-green-600 dark:bg-green-500',
  error: 'bg-red-600 dark:bg-red-500',
  warning: 'bg-orange-600 dark:bg-orange-500',
  loading: 'bg-gray-600 dark:bg-gray-400',
}

const SignalMap = {
  success: 'i-ic-round-signal-wifi-4-bar',
  error: 'i-ic-round-signal-wifi-bad',
  warning: 'i-ic-round-signal-wifi-1-bar',
  loading: 'i-ic-round-signal-wifi-4-bar',
}
