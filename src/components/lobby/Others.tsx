import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, For, onMount } from 'solid-js'
import { useConnection } from '../../context/Connection'
import { Channels } from '../Channels'
import { Action, Peer } from './others/Figure'
import { Join } from './others/Join'
import { Share } from './others/Share'

export const Others = () => {
  const [connection] = useConnection()

  return (
    <div pos="relative" flex="~ 1 col" items="center" justify="center" z="10">
      <div flex="~ wrap" items="center" justify="center" gap="4 sm:8">
        <Share />
        <For each={connection.peers} fallback={<Seeking />}>
          {item => <Peer {...item} />}
        </For>
        <Channels />
        <Join />
      </div>
    </div>
  )
}

const Seeking = () => {
  const [suffix, setSuffix] = createSignal('')

  onMount(() => {
    setInterval(() => {
      suffix().length === 3 ? setSuffix('') : setSuffix(s => (s += '.'))
    }, 600)
  })

  return (
    <Action
      name={
        <span pos="relative" font="bold" select="none">
          Seeking
          <span pos="absolute" left="full">
            {suffix()}
          </span>
        </span>
      }
      tooltip="Seeking Local Devices"
      href="/"
      text="light-100 dark:light-600"
      bg="rose-500"
    >
      <RiDevicePhoneFindFill
        w="7 sm:8"
        h="7 sm:8"
        text="light-100 dark:light-600"
      />
    </Action>
  )
}
