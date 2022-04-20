import { RiSystemDownloadFill } from 'solid-icons/ri'
import { For } from 'solid-js'
import { FileMessage } from '../../../../index.d'
import { TextButton } from '../../base/Button'
import { Subtle } from '../../base/Text'

interface FileProps {
  message: FileMessage
}

export const File = (props: FileProps) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div
      w="full sm:fit"
      max-w="full"
      m="y-2"
      p="x-4 y-3"
      flex="~ col"
      rounded="~"
      bg="light-600 dark:dark-400"
      gap="2.5"
      overflow="hidden"
    >
      <div flex="~" items="center" gap="3" text="sm">
        <span>{props.message.files.length} Files</span>
        <span flex="~ 1">
          {formatBytes(
            props.message.files.reduce((pre, cur) => pre + cur.size, 0)
          )}
        </span>
        <TextButton>Download All</TextButton>
      </div>
      <For each={props.message.files}>
        {file => (
          <div flex="~" items="center" gap="3" cursor="pointer">
            <RiSystemDownloadFill w="4" h="4" />
            <span max-w="full" text="sm truncate">
              {file.name}
            </span>
            <Subtle whitespace="nowrap">{formatBytes(file.size)}</Subtle>
          </div>
        )}
      </For>
    </div>
  )
}
