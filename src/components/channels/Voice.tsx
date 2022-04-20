import { RiCommunicationVideoChatFill } from 'solid-icons/ri'
import { useConnection } from '../../context/Connection'
import { Subtle } from '../base/Text'
import { Controls } from './voice/Controls'

export const Voice = () => {
  return (
    <div
      w="full"
      h="70vh"
      p="x-3 y-2"
      flex="~ col"
      items="center"
      justify="center"
      gap="3"
    >
      <Placeholder />
      <div p="y-1" w="full" flex="~" items="end" gap="4">
        <Controls />
      </div>
    </div>
  )
}

const Placeholder = () => {
  const [connection] = useConnection()

  return (
    <div flex="~ 1 col" items="center" justify="center">
      <RiCommunicationVideoChatFill
        w="18"
        h="18"
        m="t-12 b-6"
        text="light-800 dark:dark-200"
      />
      <h1 text="lg" font="bold">
        Connected to #{connection.id}
      </h1>
      <Subtle>You can send messages or video chat now.</Subtle>
    </div>
  )
}
