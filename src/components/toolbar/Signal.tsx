import {
  RiDeviceSignalWifi2Fill,
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
} from 'solid-icons/ri'
import { createSignal, Match, Switch } from 'solid-js'

type StatusType = 'success' | 'error' | 'warning' | 'loading'
export const Signal = () => {
  const [status, setStatus] = createSignal<StatusType>('loading')

  const signalText = (status: StatusType) =>
    status === 'success'
      ? 'Connected'
      : status === 'error'
      ? 'Lost Connection'
      : status === 'warning'
      ? 'Slow Connection'
      : 'Connecting ...'

  return (
    <div class="ui-tips reverse" title={signalText(status())}>
      <button
        aria-label="Network Status"
        flex="~"
        rounded="full"
        p="3"
        border="none"
        bg="transparent hover:light-500 dark:hover:dark-400"
      >
        <Switch>
          <Match when={status() === 'success'}>
            <RiDeviceSignalWifiFill class="w-6 h-6" text="green-500" />
          </Match>
          <Match when={status() === 'error'}>
            <RiDeviceSignalWifiErrorFill class="w-6 h-6" text="red-500" />
          </Match>
          <Match when={status() === 'warning'}>
            <RiDeviceSignalWifi2Fill class="w-6 h-6" text="yellow-500" />
          </Match>
          <Match when={status() === 'loading'}>
            <RiDeviceSignalWifiFill
              class="w-6 h-6"
              text="gray-800 dark:gray-300"
            />
          </Match>
        </Switch>
      </button>
    </div>
  )
}
