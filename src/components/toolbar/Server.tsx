import { useI18n } from '@solid-primitives/i18n'
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
  const [t] = useI18n()
  const [server] = useServer()

  const statusText = () =>
    server.status === 'closed'
      ? t('status_closed_tooltip')
      : server.status === 'connected'
      ? `${server.ping}ms`
      : server.status === 'error'
      ? t('status_error_tooltip')
      : t('status_connecting_tooltip')

  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/server'))
  const handleClose = () => navigate('/')

  return (
    <>
      <Show when={isOpen()}>
        <Title>{t('server')} - I Seek You</Title>
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
        name={t('server')}
        size="sm"
        hasTitleBar
        isOpen={isOpen()}
        onCancel={handleClose}
      >
        <div flex="~ col" p="x-3 y-2" gap="3">
          <Status />
          <Field name={t('server_webrtc')} icon={RiDeviceSignalWifiFill}>
            <Subtle>
              {t('server_description')}
              <Link
                isExternal
                href="https://github.com/Lifeni/i-seek-you-server#readme"
                m="l-1"
              >
                {t('read_docs')}
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
