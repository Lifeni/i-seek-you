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
  const [server] = useServer()

  return (
    <Field name="Server Status" icon={RiDeviceServerFill} gap="0">
      <Switch
        fallback={
          <Subtle flex="~" items="center" gap="3">
            <span font="bold" id="device-status">
              Connecting to Server...
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
              Server Connection Closed
            </span>
            <RiSystemErrorWarningFill w="4.5" h="4.5" />
          </div>
          <Subtle>Refresh the page to try to reconnect.</Subtle>
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
              Connected to Server
            </span>
            <RiSystemCheckboxCircleFill w="4.5" h="4.5" />
          </div>
          <Subtle>
            Last Ping: <strong text="base">{server.ping}ms</strong>
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
              Error Connecting to Server
            </span>
            <RiSystemCloseCircleFill w="4.5" h="4.5" />
          </div>
          <Subtle>Please check the server or report this issue.</Subtle>
        </Match>
      </Switch>
    </Field>
  )
}
