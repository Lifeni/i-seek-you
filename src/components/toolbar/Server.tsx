import { Link as SolidLink, useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceSignalWifiErrorFill,
  RiDeviceSignalWifiFill,
  RiDeviceSignalWifiOffFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Title } from 'solid-meta'
import { useServer } from '../../context/Server'
import { Field } from '../base/Form'
import { Modal } from '../base/Modal'
import { Tooltip } from '../base/Popover'
import { Link, Subtle } from '../base/Text'
import { Signaling, STUN, TURN } from './server/Address'
import { Status } from './server/Status'

export const Server = () => {
  const [server] = useServer()

  const statusText = () =>
    server.status === 'closed'
      ? 'Closed'
      : server.status === 'connected'
      ? `${server.ping}ms`
      : server.status === 'error'
      ? 'Error'
      : 'Connecting'

  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/server'))
  const handleClose = () => navigate('/')

  return (
    <>
      <Show when={isOpen()}>
        <Title>Server - I Seek You</Title>
      </Show>

      <Tooltip name={statusText()} position="bottom-right">
        <SolidLink
          id="nav-server"
          href="/server"
          flex="~"
          rounded="full"
          p="3"
          border="none"
          bg="transparent hover:light-600 dark:hover:dark-400"
        >
          <Dynamic
            component={
              server.status === 'closed'
                ? RiDeviceSignalWifiOffFill
                : server.status === 'error'
                ? RiDeviceSignalWifiErrorFill
                : RiDeviceSignalWifiFill
            }
            w="6"
            h="6"
            text={
              server.status === 'connected'
                ? 'green-500 dark:green-400'
                : server.status === 'error'
                ? 'red-500 dark:red-400'
                : 'gray-800 dark:gray-300'
            }
          />
        </SolidLink>
      </Tooltip>

      <Modal
        name="Server"
        size="sm"
        hasTitleBar
        isOpen={isOpen()}
        onCancel={handleClose}
      >
        <div flex="~ col" p="x-3 y-2" gap="3">
          <Status />
          <Field name="WebRTC Server" icon={RiDeviceSignalWifiFill}>
            <Subtle>
              You can deploy a WebRTC server of your own via Docker.
              <Link
                isExternal
                href="https://github.com/Lifeni/i-seek-you-server#readme"
              >
                Read Docs
              </Link>
            </Subtle>
            <Signaling />
            <STUN />
            <TURN />
          </Field>
        </div>
      </Modal>
    </>
  )
}
