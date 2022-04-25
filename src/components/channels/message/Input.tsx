import {
  RiBusinessSendPlaneFill,
  RiMediaImage2Fill,
  RiMediaVidiconFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, on, onCleanup, untrack } from 'solid-js'
import tinykeys from 'tinykeys'
import { FileMessage, TextMessage } from '../../../../index.d'
import { useConnection } from '../../../context/Connection'
import { useServer } from '../../../context/Server'
import { IconButton } from '../../base/Button'

export const Input = () => {
  const [server] = useServer()
  const [connection, { setMode, addMessage }] = useConnection()

  const [text, setText] = createSignal('')
  const [textarea, setTextarea] = createSignal<HTMLTextAreaElement>()
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
    connection.channel?.send('text', data)
    addMessage<TextMessage>({ type: 'text', ...data })
    setText('')

    const send = textarea()
    if (!send) return
    send.style.height = `44px`
  }

  createEffect(
    on([text, () => connection.mode], ([text, mode]) => {
      const target = textarea()
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

  const handleFile = (e: Event) => {
    const files = (e.target as HTMLInputElement).files || []
    if (files.length === 0) return
    const data = {
      type: 'file',
      date: new Date().toISOString(),
      from: server.id,
      files: [...files].map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    }

    connection.channel?.send('file', data)
    addMessage<FileMessage>(data as FileMessage)
  }

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~" items="center" gap="1">
        <IconButton
          name="Voice"
          icon={RiMediaVidiconFill}
          onClick={() => setMode('voice')}
        />
        <IconButton
          display="hidden sm:flex"
          name="File"
          icon={RiMediaImage2Fill}
          onClick={() => input()?.click()}
        />
        <input
          ref={setInput}
          type="file"
          name="file"
          multiple
          hidden
          onChange={e => handleFile(e)}
        />
      </div>
      <textarea
        ref={setTextarea}
        name="text"
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
