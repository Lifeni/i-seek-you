import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, For, onMount } from 'solid-js'
import { ChannelProvider } from '../../context/Channel'
import { Channels } from '../Channels'
import { Join } from './others/Join'
import { Share } from './others/Share'
import { Action, Peer } from './others/Figure'
import { useConfig } from '../../context/Config'
import { useConnection } from '../../context/Connection'

type PeersInfo = {
  name: string
  id: string
  password: boolean
  emoji: string
}

export const Others = () => {
  const [config] = useConfig()
  const [connection, { setId }] = useConnection()
  const [peers, setPeers] = createSignal<PeersInfo[]>([])

  onMount(() => {
    const ws = new WebSocket(config.server)
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'hello',
          name: config.name,
          password: !!config.password,
          emoji: config.emoji,
        })
      )

      setInterval(() => {
        ws.send(JSON.stringify({ type: 'ping' }))
      }, 5000)
    }

    ws.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'id': {
          setId(data.data)
          break
        }
        case 'lobby': {
          const lobby = data.data as PeersInfo[]
          setPeers(lobby.filter(peer => peer.id !== connection.id))
          break
        }
      }
    }

    ws.onclose = () => {
      setPeers([])
    }
  })

  return (
    <div
      pos="relative"
      flex="~  1"
      items="center"
      justify="center"
      z="10"
      gap="6 sm:8"
    >
      <Share />
      <For each={peers()} fallback={<Seeking />}>
        {item => <Peer {...item} />}
      </For>
      <ChannelProvider>
        <Channels />
      </ChannelProvider>
      <Join />
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
      <RiDevicePhoneFindFill w="8" h="8" text="light-100 dark:light-600" />
    </Action>
  )
}
