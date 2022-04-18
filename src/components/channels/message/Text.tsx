import { Message, useConnection } from '../../../context/Connection'
import { useServer } from '../../../context/Server'
import { useSettings } from '../../../context/Settings'
import { Tooltip } from '../../base/Popover'
import { Subtle } from '../../base/Text'

interface TextProps {
  message: Message
}

export const Text = (props: TextProps) => {
  const [settings] = useSettings()
  const [server] = useServer()
  const [connection] = useConnection()

  const self = () => props.message.from === server.id
  const peer = () =>
    self()
      ? { id: server.id, name: settings.name, emoji: settings.emoji }
      : connection.peer

  const format = (date: string) =>
    new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(date))

  return (
    <div w="full" flex="~" items="start" gap="3">
      <span
        flex="~"
        items="center"
        justify="center"
        rounded="full"
        text="3xl"
        select="none"
      >
        {peer().emoji}
      </span>
      <div w="full" flex="~ col" gap="1">
        <div w="full" flex="~" items="baseline" gap="2">
          <Tooltip name={`#${peer().id}`}>
            <span font="bold">{peer().name}</span>
          </Tooltip>

          <Tooltip name={new Date(props.message.date).toLocaleString()}>
            <Subtle>{format(props.message.date)}</Subtle>
          </Tooltip>
        </div>
        <pre w="fit" max-w="full" font="sans" whitespace="pre-wrap">
          {props.message.content}
        </pre>
      </div>
    </div>
  )
}
