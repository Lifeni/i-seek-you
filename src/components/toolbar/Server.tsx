import { Link, useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceServerFill,
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
  RiDeviceSignalWifiOffFill,
  RiSystemCheckboxCircleFill,
  RiSystemCloseCircleFill,
  RiSystemErrorWarningFill,
  RiSystemLoader2Fill,
} from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from 'solid-js'
import { Title } from 'solid-meta'
import tinykeys from 'tinykeys'
import { useSettings } from '../../context/Settings'
import { useConnection } from '../../context/Connection'
import { Modal } from '../base/Modal'

export const Server = () => {
  const [settings, { setServer }] = useSettings()
  const [connection] = useConnection()

  const statusText = () =>
    connection.status === 'closed'
      ? 'Closed'
      : connection.status === 'connected'
      ? `${connection.ping}ms`
      : connection.status === 'error'
      ? 'Error'
      : 'Connecting'

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)
  const [changed, setChanged] = createSignal(false)
  const [input, setInput] = createSignal<HTMLInputElement>()

  createEffect(() => setOpen(location.pathname === '/server'))

  const handleClose = () => navigate('/')

  onMount(() => {
    const el = input()
    if (el) {
      const unbind = tinykeys(el, { Enter: handleClose })
      onCleanup(() => unbind())
    }
  })

  return (
    <>
      <Show when={open()}>
        <Title>Server - I Seek You</Title>
      </Show>

      <Link
        role="tooltip"
        aria-label={statusText()}
        data-position="bottom-right"
        href="/server"
        flex="~"
        rounded="full"
        p="3"
        border="none"
        bg="transparent hover:light-600 dark:hover:dark-400"
      >
        <Switch
          fallback={
            <RiDeviceSignalWifiFill w="6" h="6" text="gray-800 dark:gray-300" />
          }
        >
          <Match when={connection.status === 'closed'}>
            <RiDeviceSignalWifiOffFill
              w="6"
              h="6"
              text="gray-800 dark:gray-300"
            />
          </Match>
          <Match when={connection.status === 'connected'}>
            <RiDeviceSignalWifiFill
              w="6"
              h="6"
              text="green-500 dark:green-400"
            />
          </Match>
          <Match when={connection.status === 'error'}>
            <RiDeviceSignalWifiErrorFill
              w="6"
              h="6"
              text="red-500 dark:red-400"
            />
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
            <RiDeviceServerFill w="4.5" h="4.5" />
            Server Status
          </legend>
          <div w="full" flex="~ col">
            <Switch
              fallback={
                <div
                  flex="~"
                  items="center"
                  gap="3"
                  text="sm gray-500 dark:gray-400"
                >
                  <span font="bold">Connecting to Server...</span>
                  <RiSystemLoader2Fill w="4.5" h="4.5" animate="spin" />
                </div>
              }
            >
              <Match when={connection.status === 'closed'}>
                <div
                  flex="~"
                  items="center"
                  gap="3"
                  text="orange-500 dark:orange-400"
                >
                  <span font="bold">Server Connection Closed</span>
                  <RiSystemErrorWarningFill w="4.5" h="4.5" />
                </div>
                <span text="sm gray-500 dark:gray-400">
                  Refresh the page to try to reconnect.
                </span>
              </Match>
              <Match when={connection.status === 'connected'}>
                <div
                  flex="~"
                  items="center"
                  gap="3"
                  text="green-500 dark:green-400"
                >
                  <span font="bold">Connected to Server</span>
                  <RiSystemCheckboxCircleFill w="4.5" h="4.5" />
                </div>
                <span text="sm gray-500 dark:gray-400">
                  Last ping: <strong>{connection.ping}ms</strong>
                </span>
              </Match>
              <Match when={connection.status === 'error'}>
                <div
                  flex="~"
                  items="center"
                  gap="3"
                  text="red-500 dark:red-400"
                >
                  <span font="bold">Error Connecting to Server</span>
                  <RiSystemCloseCircleFill w="4.5" h="4.5" />
                </div>
                <span text="sm gray-500 dark:gray-400">
                  Please check the server or report this issue.
                </span>
              </Match>
            </Switch>
          </div>
        </fieldset>

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
                Read Docs
              </a>
            </p>

            <input
              ref={setInput}
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
              value={settings.server}
              onInput={e => {
                setServer((e.target as HTMLInputElement).value)
                setChanged(true)
              }}
            />

            <Show when={changed()}>
              <p text="sm red-500 dark:red-400">* Need to reload the page</p>
            </Show>
          </div>
        </fieldset>
      </Modal>
    </>
  )
}
