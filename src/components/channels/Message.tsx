import { RiCommunicationQuestionAnswerFill } from 'solid-icons/ri'
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js'
import { useConnection } from '../../context/Connection'
import { Input } from './message/Input'
import { Text } from './message/Text'

export const Message = () => {
  const [connection] = useConnection()
  const [container, setContainer] = createSignal<HTMLDivElement>()

  const isEmpty = () => connection.messages.length === 0

  createEffect(() => {
    const target = container()
    if (!target || isEmpty()) return
    target.scrollTo(0, target.scrollHeight)
  })

  return (
    <div
      w="full"
      h="75vh"
      p="x-3 y-2"
      flex="~ col"
      justify="end"
      items="center"
      gap="3"
    >
      <Show
        when={!isEmpty()}
        fallback={
          <div w="full" flex="~ 1 col" items="center" justify="center">
            <RiCommunicationQuestionAnswerFill
              w="18"
              h="18"
              text="light-800 dark:dark-200"
            />
          </div>
        }
      >
        <div
          ref={setContainer}
          class="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full
           scrollbar-thumb-light-600 scrollbar-track-light-100 hover:scrollbar-thumb-light-800
             dark:(scrollbar-thumb-dark-400 scrollbar-track-dark-200 hover:scrollbar-thumb-dark-600)"
          w="full"
          p="1"
          flex="~ col"
          overflow="y-auto x-hidden"
        >
          <div w="full" flex="~ 1 col" items="center" justify="end" gap="3">
            <For each={connection.messages}>
              {message => (
                <Switch>
                  <Match when={message.type === 'text'}>
                    <Text message={message} />
                  </Match>
                </Switch>
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
