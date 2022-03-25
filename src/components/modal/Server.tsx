import { Link, useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, Match, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { Modal } from '../Modal'
import { Custom } from './server/Custom'

type StatusType = 'connected' | 'error' | 'local'

export const Server = () => {
  const [status, setStatus] = createSignal<StatusType>('local')

  const statusText =
    status() === 'local'
      ? 'Local Mode'
      : status() === 'connected'
      ? 'Connected'
      : status() === 'error'
      ? 'Error'
      : 'Unknown'

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/server'))

  const handleClose = () => navigate('/')

  return (
    <>
      <Title>Server - I Seek You</Title>

      <Link
        role="tooltip"
        aria-label={statusText}
        data-position="bottom-right"
        href="/server"
        flex="~"
        rounded="full"
        p="3"
        border="none"
        bg="transparent hover:light-600 dark:hover:dark-400"
      >
        <Switch>
          <Match when={status() === 'local'}>
            <RiDeviceSignalWifiFill
              class="w-6 h-6"
              text="gray-800 dark:gray-300"
            />
          </Match>
          <Match when={status() === 'connected'}>
            <RiDeviceSignalWifiFill class="w-6 h-6" text="green-500" />
          </Match>
          <Match when={status() === 'error'}>
            <RiDeviceSignalWifiErrorFill class="w-6 h-6" text="red-500" />
          </Match>
        </Switch>
      </Link>

      <Modal title="Server" size="sm" isOpen={open()} onClose={handleClose}>
        <Custom />
      </Modal>
    </>
  )
}
