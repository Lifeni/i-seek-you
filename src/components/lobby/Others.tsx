import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, For, onMount } from 'solid-js'
import { ChannelProvider } from '../../context/Channel'
import { useConnection } from '../../context/Connection'
import { listen } from '../../utils/websocket'
import { Channels } from '../Channels'
import { Action, Peer } from './others/Figure'
import { Join } from './others/Join'
import { Share } from './others/Share'

type PeersInfo = {
  name: string
  id: string
  password: boolean
  emoji: string
}

export const Others = () => {
  const [connection] = useConnection()
  const [peers, setPeers] = createSignal<PeersInfo[]>([])

  onMount(() => {
    listen<{ peers: PeersInfo[] }>('lobby', data => {
      const lobby = data.peers.filter(peer => peer.id !== connection.id)
      setPeers(lobby)
    })
  })

  return (
    <div pos="relative" flex="~ 1 col" items="center" justify="center" z="10">
      <div flex="~ wrap" items="center" justify="center" gap="4 sm:8">
        <Share />
        <For each={peers()} fallback={<Seeking />}>
          {item => <Peer {...item} />}
        </For>
        <ChannelProvider>
          <Channels />
        </ChannelProvider>
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
