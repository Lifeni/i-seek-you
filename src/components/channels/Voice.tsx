import { RiCommunicationVideoChatFill } from 'solid-icons/ri'
import { Controls } from './voice/Controls'

export const Voice = () => {
  return (
    <div
      w="full"
      p="x-3 y-2"
      flex="~ col"
      items="center"
      justify="center"
      gap="3"
    >
      <div flex="~ col" h="60vh" items="center" justify="center">
        <RiCommunicationVideoChatFill
          w="18"
          h="18"
          text="light-800 dark:dark-200"
        />
      </div>
      <div p="y-1" w="full" flex="~" items="end" gap="4">
        <Controls />
      </div>
    </div>
  )
}
