import { useI18n } from '@solid-primitives/i18n'
import {
  RiDeviceServerFill,
  RiSystemCheckboxCircleFill,
  RiSystemCloseCircleFill,
  RiSystemErrorWarningFill,
  RiSystemLoader2Fill,
} from 'solid-icons/ri'
import { Match, Switch } from 'solid-js'
import { useServer } from '../../../context/Server'
import { Field } from '../../base/Form'
import { Subtle } from '../../base/Text'

export const Status = () => {
  const [t] = useI18n()
  const [server] = useServer()

  return (
    <Field name={t('server_status')} icon={RiDeviceServerFill} gap="0">
      <Switch
        fallback={
          <Subtle flex="~" items="center" gap="3">
            <span font="bold" id="device-status">
              {t('server_status_connecting')}
            </span>
            <RiSystemLoader2Fill w="4.5" h="4.5" animate="spin" />
          </Subtle>
        }
      >
        <Match when={server.status === 'closed'}>
          <div
            flex="~"
            items="center"
            gap="3"
            p="b-1"
            text="orange-500 dark:orange-400"
            leading="tight"
          >
            <span font="bold" id="device-status">
              {t('server_status_closed')}
            </span>
            <RiSystemErrorWarningFill w="4.5" h="4.5" />
          </div>
          <Subtle>{t('server_status_closed_description')}</Subtle>
        </Match>
        <Match when={server.status === 'connected'}>
          <div
            flex="~"
            items="center"
            gap="3"
            p="b-1"
            text="green-500 dark:green-400"
            leading="tight"
          >
            <span font="bold" id="device-status">
              {t('server_status_connected')}
            </span>
            <RiSystemCheckboxCircleFill w="4.5" h="4.5" />
          </div>
          <Subtle>
            {t('server_status_connected_ping')}
            <strong text="base">{server.ping}ms</strong>
          </Subtle>
        </Match>
        <Match when={server.status === 'error'}>
          <div
            flex="~"
            items="center"
            gap="3"
            p="b-1"
            text="red-500 dark:red-400"
            leading="tight"
          >
            <span font="bold" id="device-status">
              {t('server_status_error')}
            </span>
            <RiSystemCloseCircleFill w="4.5" h="4.5" />
          </div>
          <Subtle>{t('server_status_error_description')}</Subtle>
        </Match>
      </Switch>
    </Field>
  )
}
