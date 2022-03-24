import { useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceSignalWifi2Fill,
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
} from 'solid-icons/ri'
import { createSignal, Match, onMount, Switch } from 'solid-js'
import { Modal } from '../Modal'
import { Custom } from './server/Custom'

type StatusType = 'success' | 'error' | 'warning' | 'loading'

export const Server = () => {
  const [status, setStatus] = createSignal<StatusType>('loading')

  const signalText = (status: StatusType) =>
    status === 'success'
      ? 'Connected'
      : status === 'error'
      ? 'Lost Connection'
      : status === 'warning'
      ? 'Slow Connection'
      : 'Connecting ...'

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    if (location.pathname === '/server') handleOpen()
  })

  const handleOpen = () => {
    setOpen(true)
    navigate('/server')
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <button
        role="tooltip"
        aria-label={signalText(status())}
        data-position="bottom-right"
        flex="~"
        rounded="full"
        p="3"
        border="none"
        bg="transparent hover:light-600 dark:hover:dark-400"
        onClick={handleOpen}
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

      <Modal title="Server" size="sm" isOpen={open()} onClose={handleClose}>
        <Custom />
      </Modal>
    </>
  )
}
