import { type IconTypes } from 'solid-icons'
import {
  RiBusinessSendPlaneFill,
  RiMediaImage2Fill,
  RiMediaVidiconFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, on, onCleanup, untrack } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import tinykeys from 'tinykeys'
import { useBuffer } from '../../../context/Buffer'
import { useChannel } from '../../../context/Channel'
import { useConnection } from '../../../context/Connection'

export const Input = () => {
  const [connection] = useConnection()
  const [channel, { setMode }] = useChannel()
  const [, { addMessage }] = useBuffer()
  const [text, setText] = createSignal('')
  const [send, setSend] = createSignal<HTMLInputElement>()

  const mode = () => channel.mode

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    if (target.value) {
      setText(target.value)
      target.style.height = `44px`
      target.style.height = `${
        target.scrollHeight > 200 ? 200 : target.scrollHeight
      }px`
    }
  }

  const handleSend = () => {
    const message = text()
    if (message) {
      const data = {
        date: new Date().toISOString(),
        from: connection.id,
        content: message,
      }
      channel.connection?.send('text', data)
      addMessage({
        type: 'text',
        ...data,
      })
      setText('')
      const input = send()
      if (input) input.style.height = `44px`
    }
  }

  createEffect(
    on([text, mode], ([text, mode]) => {
      const input = send()
      if (input && mode === 'message') {
        const unbind = tinykeys(input, {
          Enter: e => {
            e.preventDefault()
            untrack(() => handleSend())
          },
        })
        onCleanup(() => unbind())
      } else if (text && mode === 'other') setText('')
    })
  )

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~" items="center">
        <Action
          title="Voice"
          icon={RiMediaVidiconFill}
          onClick={() => setMode('voice')}
        />
        <Action title="File" icon={RiMediaImage2Fill} onClick={() => {}} />
      </div>
      <textarea
        ref={setSend}
        placeholder="Type Here..."
        w="full"
        h="11"
        max-h="200px"
        flex="~ 1"
        p="x-4 y-2.25"
        text="inherit"
        border="none"
        bg="light-600 dark:dark-400"
        rounded="md"
        outline="none"
        resize="none"
        value={text()}
        onInput={handleInput}
      />
      <div flex="~" items="center">
        <Action
          title="Send"
          icon={RiBusinessSendPlaneFill}
          onClick={() => handleSend()}
        />
      </div>
    </div>
  )
}

interface ActionProps {
  title: string
  icon: IconTypes
  onClick: () => void
}

const Action = (props: ActionProps) => (
  <button
    role="tooltip"
    aria-label={props.title}
    data-position="top"
    w="11"
    h="11"
    flex="~"
    justify="center"
    items="center"
    rounded="full"
    text="inherit"
    bg="hover:(light-600 dark:dark-400)"
    onClick={() => props.onClick()}
  >
    <Dynamic component={props.icon} w="5" h="5" />
  </button>
)
