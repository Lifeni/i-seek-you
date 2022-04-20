import {
  RiCommunicationChat3Fill,
  RiCommunicationQuestionAnswerFill,
} from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  type JSX,
} from 'solid-js'
import { FileMessage, TextMessage } from '../../../index.d'
import { useConnection } from '../../context/Connection'
import { useServer } from '../../context/Server'
import { useSettings } from '../../context/Settings'
import { Tooltip } from '../base/Popover'
import { Subtle } from '../base/Text'
import { File } from './message/File'
import { Input } from './message/Input'
import { Text } from './message/Text'

export const Message = () => {
  const [settings] = useSettings()
  const [server] = useServer()
  const [connection] = useConnection()
  const [container, setContainer] = createSignal<HTMLDivElement>()

  const isEmpty = () => connection.messages.length === 0

  const getAuthor = (from: string, index: number) =>
    index - 1 >= 0 && from === connection.messages[index - 1].from
      ? undefined
      : from === server.id
      ? { id: server.id, name: settings.name, emoji: settings.emoji }
      : connection.peer

  const formatTime = (date: string | Date) =>
    new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(date))

  createEffect(() => {
    const target = container()
    if (!target || isEmpty()) return
    target.scrollTo(0, target.scrollHeight)
  })

  return (
    <div
      w="full"
      h="70vh"
      p="x-3 y-2"
      flex="~ col"
      justify="end"
      items="center"
      gap="3"
    >
      <Show when={!isEmpty()} fallback={<Placeholder />}>
        <div
          ref={setContainer}
          class="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full
           scrollbar-thumb-light-600 scrollbar-track-light-100 hover:scrollbar-thumb-light-800
             dark:(scrollbar-thumb-dark-400 scrollbar-track-dark-200 hover:scrollbar-thumb-dark-600)"
          w="full"
          p="x-2 y-1"
          flex="~ col"
          overflow="y-auto x-hidden"
        >
          <div w="full" flex="~ 1 col" items="center" justify="end" gap="1">
            <Subtle m="b-1 sm:b-3" flex="~" items="center" gap="2">
              <RiCommunicationChat3Fill w="4" h="4" />
              The messages start at {formatTime(new Date())}.
            </Subtle>
            <For each={connection.messages}>
              {(message, index) => (
                <div w="full" flex="~" items="start" gap="2">
                  <div
                    w="8 sm:12"
                    min-w="8 sm:12"
                    m="t-2 b-1"
                    flex="~"
                    justify="center"
                    display="hidden sm:flex"
                  >
                    <Show when={getAuthor(message.from, index())}>
                      <Avatar>{getAuthor(message.from, index())?.emoji}</Avatar>
                    </Show>
                  </div>

                  <div w="full" flex="~ col">
                    <Show when={getAuthor(message.from, index())}>
                      <div
                        w="full"
                        flex="~"
                        m="t-2 b-1"
                        items="center sm:baseline"
                        gap="2.5 sm:3"
                      >
                        <Avatar w="6" display="flex sm:hidden" size="sm">
                          {getAuthor(message.from, index())?.emoji}
                        </Avatar>

                        <span font="bold">
                          {getAuthor(message.from, index())?.name} #
                          {getAuthor(message.from, index())?.id}
                        </span>

                        <Tooltip name={new Date(message.date).toLocaleString()}>
                          <Subtle>{formatTime(message.date)}</Subtle>
                        </Tooltip>
                      </div>
                    </Show>

                    <Switch>
                      <Match when={message.type === 'text'}>
                        <Text message={message as TextMessage} />
                      </Match>
                      <Match when={message.type === 'file'}>
                        <File message={message as FileMessage} />
                      </Match>
                    </Switch>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      <div p="y-1" w="full" flex="~" items="end" gap="4">
        <Input />
      </div>
    </div>
  )
}

interface AvatarProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md'
}

const Avatar = (props: AvatarProps) => (
  <span
    flex="~"
    items="center"
    justify="center"
    rounded="full"
    text={props.size === 'sm' ? 'xl' : 'xl sm:3xl'}
    select="none"
    {...props}
  >
    {props.children}
  </span>
)

const Placeholder = () => {
  const [connection] = useConnection()

  return (
    <div w="full" flex="~ 1 col" items="center" justify="center">
      <RiCommunicationQuestionAnswerFill
        w="18"
        h="18"
        m="t-12 b-6"
        text="light-800 dark:dark-200"
      />
      <h1 text="lg" font="bold">
        Connected to #{connection.id}
      </h1>
      <Subtle>You can send messages or video chat now.</Subtle>
    </div>
  )
}
