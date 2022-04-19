import {
  RiBusinessSendPlaneFill,
  RiMediaImage2Fill,
  RiMediaVidiconFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, on, onCleanup, untrack } from 'solid-js'
import tinykeys from 'tinykeys'
import { useConnection } from '../../../context/Connection'
import { useServer } from '../../../context/Server'
import { IconButton } from '../../base/Button'

export const Input = () => {
  const [server] = useServer()
  const [connection, { setMode, addMessage }] = useConnection()

  const [text, setText] = createSignal('')
  const [input, setInput] = createSignal<HTMLInputElement>()

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    if (!target.value) return

    setText(target.value)
    target.style.height = `44px`
    target.style.height = `${
      target.scrollHeight > 200 ? 200 : target.scrollHeight
    }px`
  }

  const handleSend = () => {
    const message = text()
    if (!message) return

    const data = {
      date: new Date().toISOString(),
      from: server.id,
      content: message,
    }
    connection.webrtc?.send('text', data)
    addMessage({ type: 'text', ...data })
    setText('')

    const send = input()
    if (!send) return
    send.style.height = `44px`
  }

  createEffect(
    on([text, () => connection.mode], ([text, mode]) => {
      const target = input()
      if (text && mode === 'other') setText('')
      if (!target || mode !== 'message') return

      const unbind = tinykeys(target, {
        Enter: e => {
          e.preventDefault()
          untrack(() => handleSend())
        },
      })
      onCleanup(() => unbind())
    })
  )

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~" items="center">
        <IconButton
          name="Voice"
          icon={RiMediaVidiconFill}
          onClick={() => setMode('voice')}
        />
        <IconButton
          display="hidden sm:flex"
          name="File"
          icon={RiMediaImage2Fill}
          onClick={() => {}}
        />
      </div>
      <textarea
        ref={setInput}
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
        <IconButton
          display="flex sm:hidden"
          name="File"
          icon={RiMediaImage2Fill}
          onClick={() => {}}
        />
        <IconButton
          display="hidden sm:flex"
          name="Send"
          icon={RiBusinessSendPlaneFill}
          onClick={() => handleSend()}
        />
      </div>
    </div>
  )
}
