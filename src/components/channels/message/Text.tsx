import { Message } from '../../../context/Buffer'
import { useChannel } from '../../../context/Channel'
import { useConnection } from '../../../context/Connection'
import { useSettings } from '../../../context/Settings'

interface TextProps {
  message: Message
}

export const Text = (props: TextProps) => {
  const [settings] = useSettings()
  const [connection] = useConnection()
  const [channel] = useChannel()

  const self = () => props.message.from === connection.id
  const peer = () =>
    self()
      ? { id: connection.id, name: settings.name, emoji: settings.emoji }
      : channel.peer

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
          <span
            role="tooltip"
            aria-label={`#${peer().id}`}
            data-position="top"
            font="bold"
          >
            {peer().name}
          </span>
          <span
            role="tooltip"
            aria-label={new Date(props.message.date).toLocaleString()}
            data-position="top"
            text="sm gray-500 dark:gray-400"
          >
            {format(props.message.date)}
          </span>
        </div>
        <pre w="fit" max-w="full" font="sans" whitespace="pre-wrap">
          {props.message.content}
        </pre>
      </div>
    </div>
  )
}
