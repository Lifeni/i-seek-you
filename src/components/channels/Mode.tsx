import { Toggle } from 'solid-headless'
import { RiCommunicationMessage2Fill, RiMediaVidiconFill } from 'solid-icons/ri'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useChannel } from '../../context/Channel'

export const Mode = () => {
  const [channel, { setMode }] = useChannel()
  const handleMode = (e: boolean) => (e ? setMode('voice') : setMode('text'))

  return (
    <Toggle pressed={channel.mode === 'text'} onChange={handleMode}>
      <div pos="relative" flex="~" rounded="full" bg="light-600 dark:dark-400">
        <For
          each={[
            { icon: RiCommunicationMessage2Fill, name: 'Text' },
            { icon: RiMediaVidiconFill, name: 'Voice' },
          ]}
        >
          {item => (
            <span
              role="tooltip"
              aria-label={item.name}
              data-position="top"
              flex="~"
              items="center"
              justify="center"
              w="12"
              h="12"
              rounded="full"
              z="1"
              text={
                channel.mode === item.name.toLowerCase()
                  ? 'light-100 dark:light-600'
                  : 'inherit'
              }
            >
              <Dynamic component={item.icon} class="w-6 h-6" />
            </span>
          )}
        </For>

        <span
          pos="absolute"
          top="0"
          left="0"
          w="12"
          h="12"
          rounded="full"
          bg="rose-500"
          transform={
            channel.mode === 'voice' ? '~ translate-x-12' : '~ translate-x-0'
          }
          transition="transform"
          shadow="lg"
        />
      </div>
    </Toggle>
  )
}
