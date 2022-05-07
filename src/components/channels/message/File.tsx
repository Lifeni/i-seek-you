import {
  RiSystemCheckboxCircleFill,
  RiSystemDownloadFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, on, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { FileBlob, FileMessage } from '../../../../index.d'
import { useConnection } from '../../../context/Connection'
import { useServer } from '../../../context/Server'
import { Subtle } from '../../base/Text'

interface FileProps {
  message: FileMessage
  onUpdate: () => void
}

export const File = (props: FileProps) => {
  const [server] = useServer()
  const [connection] = useConnection()
  const [file, setFile] = createSignal<FileBlob | null>(null)
  const [progress, setProgress] = createSignal(0)

  const url = () => {
    const blob = file()?.blob
    return blob ? URL.createObjectURL(blob) : undefined
  }
  const isDownloaded = () => file()?.progress === 100
  const isAuthor = () => server.id === props.message.from
  const isDownloadable = () => file()?.blob && isDownloaded()

  const isImage = () => url() && props.message.file.type.startsWith('image/')

  createEffect(
    on([() => connection.files], () => {
      const id = props.message.file.id
      const blob = connection.files.find(file => file.id === id) || null
      setProgress(blob?.progress || 0)
      if (blob?.progress === 0) props.onUpdate()
      if (blob?.progress !== 100) return
      setFile(blob)
      setTimeout(() => props.onUpdate(), 200)
    })
  )

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <Dynamic
      component={isDownloadable() ? 'a' : 'div'}
      href={isDownloadable() ? url() : undefined}
      download={isDownloadable() ? props.message.file.name : undefined}
      pos="relative"
      w="fit"
      max-w="full sm:fit"
      flex="~ col"
      rounded="~"
      text="no-underline inherit"
      bg="light-600 dark:dark-400"
      overflow="hidden"
      cursor={isDownloadable() ? 'pointer' : undefined}
      class="group"
    >
      <Show when={isImage() && isDownloaded()}>
        <img
          src={url()}
          max-h="40vh"
          alt={props.message.file.name}
          rounded="t-default"
        />
        <div
          pos="absolute"
          left="0"
          bottom="0"
          w="full"
          p="x-3 y-2.5"
          text="sm truncate light-100 dark:light-600 shadow-xl"
          flex="~"
          gap="3"
          items="center"
          justify="between"
          opacity="0"
          group-hover="opacity-100"
          transition="opacity"
        >
          <span text="truncate">{props.message.file.name}</span>
          <span whitespace="nowrap">
            {formatBytes(props.message.file.size)}
          </span>
        </div>
      </Show>

      <div
        w="full"
        p="x-3 y-2.5"
        flex="col"
        items="center"
        justify="start"
        gap="1"
        display={isImage() && isDownloaded() ? 'hidden' : 'flex'}
      >
        <span w="full" max-w="120" text="sm truncate">
          {props.message.file.name}
        </span>

        <div w="full" flex="~" items="center" justify="between" gap="3">
          <section flex="~ 1" items="center" gap="2">
            <Show
              when={isDownloaded()}
              fallback={
                <span
                  aria-label="Downloading"
                  min-w="4"
                  min-h="4"
                  border="3 light-800 dark:dark-200 !t-rose-500 rounded-full"
                  animate="spin"
                />
              }
            >
              <Dynamic
                component={
                  isAuthor() ? RiSystemCheckboxCircleFill : RiSystemDownloadFill
                }
                min-w="4"
                min-h="4"
                text="green-500 dark:green-400"
              />

              <Subtle>File</Subtle>
            </Show>
          </section>

          <Subtle whitespace="nowrap">
            {formatBytes(props.message.file.size)}
          </Subtle>
        </div>
      </div>
      <div
        role="progressbar"
        pos="absolute"
        left="0"
        bottom="0"
        w="full"
        h="0.75"
        rounded="full"
        bg="light-800 dark:dark-200"
        opacity={isDownloaded() ? '0' : '100'}
      >
        <div
          h="0.75"
          bg="green-500 dark:green-400"
          transition="all"
          style={{ width: `${progress()}%` }}
        >
          <span class="sr-only">{progress()}%</span>
        </div>
      </div>
    </Dynamic>
  )
}
