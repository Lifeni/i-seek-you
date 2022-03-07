import { createSignal, lazy, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Tooltip } from './base/Tooltip'

const Settings = lazy(() => import('./modal/Settings'))

type StatusType = 'success' | 'error' | 'warning' | 'loading'

export const Toolbar = () => {
  const [status, setStatus] = createSignal<StatusType>('loading')
  const [showSettings, setShowSettings] = createSignal(false)

  const iconStyle = () => `${BackgroundMap[status()]} ${SignalMap[status()]}`

  const handleOpen = () => setShowSettings(true)
  const handleClose = () => setShowSettings(false)

  return (
    <header w="full" flex="between" p="x-10 y-6 sm:x-12" z="20" role="toolbar">
      <div flex="start">
        <Tooltip label={TextMap[status()]} position="right">
          <button
            aria-label="Network Status"
            class={`${iconStyle()}`}
            w="6"
            h="6"
            border="none"
            text="light"
            rounded="full"
          />
        </Tooltip>
      </div>
      <h1 text="xl center" select="none" flex="1">
        I Seek You
      </h1>
      <div flex="end">
        <Tooltip label="Settings" position="left">
          <button
            aria-label="Settings"
            class="button i-ic-round-settings"
            w="6"
            h="6"
            text="light hover:main"
            rounded="full"
            transition
            onClick={handleOpen}
          />
        </Tooltip>
        <Show when={showSettings()}>
          <Portal>
            <Settings close={handleClose} />
          </Portal>
        </Show>
      </div>
    </header>
  )
}

const TextMap = {
  success: 'Connected',
  error: 'Lost Connection',
  warning: 'Slow Connection',
  loading: 'Connecting ...',
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
