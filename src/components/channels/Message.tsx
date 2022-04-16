import { RiCommunicationQuestionAnswerFill } from 'solid-icons/ri'
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js'
import { useBuffer } from '../../context/Buffer'
import { Text } from './message/Text'
import { Input } from './message/Input'

export const Message = () => {
  const [buffer] = useBuffer()
  const [box, setBox] = createSignal<HTMLDivElement>()
  const isEmpty = () => buffer.messages.length === 0

  createEffect(() => {
    const div = box()
    if (div && buffer.messages.length > 0) div.scrollTo(0, div.scrollHeight)
  })

  return (
    <div w="full" m="t-2" flex="~ col" justify="end" items="center" gap="3">
      <Show
        when={!isEmpty()}
        fallback={
          <div w="full" h="60vh" flex="~ col" items="center" justify="center">
            <RiCommunicationQuestionAnswerFill
              w="18"
              h="18"
              text="light-800 dark:dark-200"
            />
          </div>
        }
      >
        <div
          ref={setBox}
          class="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full
           scrollbar-thumb-light-600 scrollbar-track-white hover:scrollbar-thumb-light-800
             dark:(scrollbar-thumb-dark-400 scrollbar-track-dark-200 hover:scrollbar-thumb-dark-600)"
          w="full"
          h="60vh"
          p="1"
          flex="~ col"
          overflow="y-auto x-hidden"
        >
          <div w="full" flex="~ 1 col" items="center" justify="end" gap="3">
            <For each={buffer.messages}>
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

      <div w="full" flex="~" items="end" gap="4">
        <Input />
      </div>
    </div>
  )
}
