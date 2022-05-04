import {
  RiCommunicationQuestionAnswerFill,
  RiSystemLock2Fill,
} from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  splitProps,
  Switch,
  type JSX,
} from 'solid-js'
import { FileMessage, TextMessage } from '../../..'
import { useConnection } from '../../context/Connection'
import { useServer } from '../../context/Server'
import { useSettings } from '../../context/Settings'
import { Tooltip } from '../base/Popover'
import { Subtle } from '../base/Text'
import { File } from './message/File'
import { Input } from './message/Input'
import { Text } from './message/Text'

export const Messages = () => {
  const [connection] = useConnection()
  const [container, setContainer] = createSignal<HTMLDivElement>()

  const isEmpty = () => connection.messages.length === 0
  createEffect(() => handleUpdate)

  const handleUpdate = () => {
    const target = container()
    if (!target || isEmpty()) return
    target.scrollTo(0, target.scrollHeight)
  }

  return (
    <div w="full" p="x-3 y-2" flex="~ col" justify="end" items="center" gap="2">
      <Show when={!isEmpty()} fallback={<Placeholder />}>
        <div
          ref={setContainer}
          class="sm:scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full
           scrollbar-thumb-light-600 scrollbar-track-light-100 hover:scrollbar-thumb-light-800
             dark:(scrollbar-thumb-dark-600 scrollbar-track-dark-800 hover:scrollbar-thumb-dark-400)"
          w="full"
          min-h="60vh"
          max-h="60vh"
          p="x-2 y-0.5"
          flex="~ col"
          overflow="y-auto x-hidden"
          style={{ 'scroll-behavior': 'smooth' }}
        >
          <div w="full" flex="~ 1 col" items="center" justify="end" gap="3">
            <Subtle
              max-w="48 sm:full"
              m="b-2 sm:b-3"
              flex="~"
              items="center"
              text="center sm gray-500 dark:gray-400"
              gap="0 sm:2"
            >
              <RiSystemLock2Fill w="4" h="4" />
              Message End-to-End Encryption Enabled
            </Subtle>
            <For each={connection.messages}>
              {message => <Message message={message} onUpdate={handleUpdate} />}
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

interface MessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  message: TextMessage | FileMessage
  onUpdate: () => void
}

const Message = (props: MessageProps) => {
  const [settings] = useSettings()
  const [server] = useServer()
  const [connection] = useConnection()
  const [local, others] = splitProps(props, ['message', 'onUpdate'])

  const isAuthor = () => local.message.from === server.id
  const getAuthor = () =>
    isAuthor()
      ? { id: server.id, name: settings.name, emoji: settings.emoji }
      : connection.peer

  return (
    <div
      pos="relative"
      w="full"
      flex={isAuthor() ? '~ row-reverse' : '~ row'}
      items="start"
      justify="start"
      gap="2 sm:3"
      {...others}
    >
      <div
        pos="sticky"
        top="0"
        max-w="7 sm:9"
        min-w="7 sm:9"
        flex="~"
        justify="center"
      >
        <Tooltip
          name={`#${getAuthor().id} ${new Date(
            local.message.date
          ).toLocaleString()}`}
          position={isAuthor() ? 'top-left' : 'top-right'}
        >
          <span
            flex="~"
            items="center"
            justify="center"
            rounded="full"
            text="2xl sm:3xl"
            font="emoji"
            select="none"
          >
            {getAuthor()?.emoji}
          </span>
        </Tooltip>
      </div>

      <div
        max-w="9/10 sm:4/5"
        flex="~ col"
        items={isAuthor() ? 'end' : 'start'}
        gap="1"
        overflow="hidden"
      >
        <Switch>
          <Match when={local.message.type === 'text'}>
            <Text
              message={local.message as TextMessage}
              isAuthor={isAuthor()}
            />
          </Match>
          <Match when={local.message.type === 'file'}>
            <File
              message={local.message as FileMessage}
              onUpdate={() => local.onUpdate()}
            />
          </Match>
        </Switch>
      </div>
    </div>
  )
}

const Placeholder = () => {
  const [connection] = useConnection()

  return (
    <div w="full" min-h="60vh" flex="~ 1 col" items="center" justify="center">
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
