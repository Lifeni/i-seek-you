import { useI18n } from '@solid-primitives/i18n'
import {
  RiBusinessSendPlaneFill,
  RiMediaImage2Fill,
  RiMediaVidiconFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, on, onCleanup, untrack } from 'solid-js'
import tinykeys from 'tinykeys'
import { v4 as uuid } from 'uuid'
import { type FileMessage, type TextMessage } from '../../../../index.d'
import { useConnection } from '../../../context/Connection'
import { useServer } from '../../../context/Server'
import { IconButton } from '../../base/Button'

export const Input = () => {
  const [t] = useI18n()
  const [server] = useServer()
  const [connection, { setMode, addMessage, addFile, setProgress }] =
    useConnection()

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
    connection.channel?.sendMessage('text', data)
    addMessage<TextMessage>({ id: uuid(), type: 'text', ...data })
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

  const handleFile = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files || []
    if (files.length === 0) return

    const messages = [...files]
      .filter(file => file.size > 0)
      .map(file => ({
        id: uuid(),
        type: 'file',
        date: new Date().toISOString(),
        from: server.id,
        file: {
          id: uuid(),
          name: file.name,
          type: file.type,
          size: file.size,
        },
      })) as FileMessage[]

    const sendFile = async (message: FileMessage, file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        const handleError = (event: ProgressEvent<FileReader>) => {
          console.debug('[file-reader]', 'read file error', event)
          reject('read file error')
        }

        const handleLoad = () => {
          const result = reader.result as ArrayBuffer
          if (!result) return

          worker?.postMessage({
            action: 'hash-file',
            file: new Uint8Array(result),
          })
        }

        const handleMessage = (event: MessageEvent) => {
          const { type, hash } = event.data
          if (type !== 'hash-file') return
          addMessage<FileMessage>(message)
          addFile({ ...message.file, progress: 0, blob: file })
          connection.channel?.sendMessage('file', {
            ...message,
            file: { ...message.file, hash: hash },
          })

          console.debug('[file-message]', 'file message send')
          reader.removeEventListener('error', handleError)
          reader.removeEventListener('load', handleLoad)
          reader.removeEventListener('abort', handleError)
          worker?.removeEventListener('message', handleMessage)

          resolve()
        }

        const worker = server.worker
        worker?.addEventListener('message', handleMessage)
        reader.addEventListener('load', handleLoad)
        reader.addEventListener('error', handleError)
        reader.addEventListener('abort', handleError)
        reader.readAsArrayBuffer(file)
      })

    const sendBuffer = (message: FileMessage, file: File) =>
      new Promise<void>((resolve, reject) => {
        const chunk = 32 * 1024
        const reader = new FileReader()
        let offset = 0

        const handleError = (event: ProgressEvent<FileReader>) => {
          console.debug('[file-reader]', 'read file error', event)
          reject('read file error')
        }

        const handleLoad = () => {
          const result = reader.result as ArrayBuffer
          if (!result) return

          worker?.postMessage({
            action: 'encrypt',
            buffer: new Uint8Array(result),
            id: 'file',
            length: result.byteLength,
          })
        }

        const handleMessage = (event: MessageEvent) => {
          const { type, encrypt, id, length } = event.data
          if (type !== 'encrypt' || id !== 'file') return
          connection.channel?.sendFile(encrypt)

          offset += length
          const progress = (offset / message.file.size) * 100
          console.debug('[file-reader]', 'file load ->', progress, offset)
          setProgress(message.file.id, progress)
          if (offset < message.file.size) slice(offset)

          if (progress !== 100) return
          console.debug('[file-reader]', 'file send')
          reader.removeEventListener('error', handleError)
          reader.removeEventListener('load', handleLoad)
          reader.removeEventListener('abort', handleError)
          worker?.removeEventListener('message', handleMessage)
          resolve()
        }

        const worker = server.worker
        worker?.addEventListener('message', handleMessage)
        reader.addEventListener('load', handleLoad)
        reader.addEventListener('error', handleError)
        reader.addEventListener('abort', handleError)

        const slice = (start: number) => {
          const blob = file.slice(start, start + chunk)
          reader.readAsArrayBuffer(blob)
        }

        slice(0)
      })

    for (const [i, message] of messages.entries()) {
      if (message.file.size > 512 * 1024 * 1024) {
        alert(t('file_limit', { name: message.file.name }))
        continue
      }
      await sendFile(message, files[i])
      await sendBuffer(message, files[i])
    }
  }

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~" items="center" gap="1">
        <IconButton
          name={t('message_voice')}
          icon={RiMediaVidiconFill}
          onClick={() => setMode('voice')}
        />
        <IconButton
          display="hidden sm:flex"
          name={t('message_file')}
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
        placeholder={t('message_placeholder')}
        w="full"
        h="11"
        max-h="100px"
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
          name={t('message_file')}
          icon={RiMediaImage2Fill}
          onClick={() => input()?.click()}
        />
        <IconButton
          display="hidden sm:flex"
          name={t('message_send')}
          icon={RiBusinessSendPlaneFill}
          onClick={() => handleSend()}
        />
      </div>
    </div>
  )
}
