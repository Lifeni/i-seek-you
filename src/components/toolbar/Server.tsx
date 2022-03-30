import { Link, useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { useConfig } from '../../context/Config'
import { Modal } from '../base/Modal'

type StatusType = 'connected' | 'error' | 'local'

export const Server = () => {
  const [config, { setServer }] = useConfig()
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
      <Show when={open()}>
        <Title>Server - I Seek You</Title>
      </Show>

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
            <RiDeviceSignalWifiFill w="6" h="6" text="gray-800 dark:gray-300" />
          </Match>
          <Match when={status() === 'connected'}>
            <RiDeviceSignalWifiFill w="6" h="6" text="green-500" />
          </Match>
          <Match when={status() === 'error'}>
            <RiDeviceSignalWifiErrorFill w="6" h="6" text="red-500" />
          </Match>
        </Switch>
      </Link>

      <Modal title="Server" size="sm" isOpen={open()} onClose={handleClose}>
        <fieldset w="full" p="3">
          <legend
            flex="~"
            justify="center"
            items="center"
            text="sm gray-500 dark:gray-400"
            font="bold"
            gap="2"
          >
            <RiDeviceSignalWifiFill w="4.5" h="4.5" /> WebRTC Server
          </legend>
          <div w="full" flex="~ col" gap="2">
            <p text="sm gray-500 dark:gray-400">
              You can deploy a WebRTC server of your own via Docker.
              <a
                href="https://github.com/Lifeni/i-seek-you-server#readme"
                target="_blank"
                rel="noopener noreferrer"
                m="x-2"
                text="rose-500 hover:underline"
                font="bold"
              >
                Read docs
              </a>
            </p>

            <input
              id="webrtc-server"
              type="text"
              name="webrtc-server"
              placeholder="https://server.i-seek-you.dist.run"
              flex="~ 1"
              m="t-1"
              p="x-3 y-2"
              border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
              text="inherit"
              bg="light-600 dark:dark-400"
              ring="focus:4 rose-500"
              transition="border"
              cursor="disabled:not-allowed"
              outline="none"
              value={config.server}
              onInput={e => setServer((e.target as HTMLInputElement).value)}
            />
          </div>
        </fieldset>
      </Modal>
    </>
  )
}
