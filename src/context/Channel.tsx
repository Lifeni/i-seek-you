import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Peer } from '../../index.d'
import { type PeerConnection } from '../networks/PeerConnection'
import { useConnection } from './Connection'

type Mode = 'message' | 'voice' | 'other'

type Signal =
  | 'idle'
  | 'auth'
  | 'loading'
  | 'call'
  | 'answer'
  | 'error'
  | 'sdp'
  | 'ice'
  | 'connected'

export type Channel = [
  {
    mode: Mode
    signal: Signal
    info: string
    error: string
    id: string
    peer: Peer
    confirm: boolean
    connection: InstanceType<typeof PeerConnection> | null
  },
  {
    setMode: (mode: Mode) => void
    setSignal: (signal: Signal) => void
    setInfo: (info: string) => void
    setError: (error: string) => void
    setConnection: (connection: InstanceType<typeof PeerConnection>) => void
    setId: (id: string) => void
    setPeer: (peer: Peer) => void
    setConfirm: (confirm: boolean) => void
    resetChannel: () => void
  }
]

const defaultPeer: Peer = {
  id: '',
  emoji: '',
  name: '',
  password: false,
}

const defaultChannel: Channel = [
  {
    mode: 'other',
    signal: 'idle',
    info: '',
    id: '',
    peer: defaultPeer,
    error: '',
    confirm: false,
    connection: null,
  },
  {
    setMode: () => {},
    setSignal: () => {},
    setInfo: () => {},
    setError: () => {},
    setId: () => {},
    setPeer: () => {},
    setConfirm: () => {},
    setConnection: () => {},
    resetChannel: () => {},
  },
]

export const ChannelContext = createContext<Channel>(defaultChannel)

export const useChannel = () => useContext(ChannelContext)

export const ChannelProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [connection] = useConnection()
  const [channel, setChannel] = createStore<Channel[0]>({
    ...defaultChannel[0],
  })

  const store: Channel = [
    channel,
    {
      setMode: (mode: Mode) => setChannel('mode', () => mode),
      setSignal: (signal: Signal) => setChannel('signal', () => signal),
      setInfo: (info: string) => setChannel('info', () => info),
      setError: (error: string) => setChannel('error', () => error),
      setConnection: (connection: InstanceType<typeof PeerConnection>) =>
        setChannel('connection', () => connection),
      setId: (id: string) =>
        untrack(() => {
          if (id && id !== connection.id && id !== channel.id)
            setChannel('id', () => id)
        }),
      setPeer: (peer: Peer) => setChannel('peer', () => peer),
      setConfirm: (confirm: boolean) => setChannel('confirm', () => confirm),
      resetChannel: () => {
        untrack(() => channel.connection?.close())
        setChannel({ ...defaultChannel[0] })
      },
    },
  ]

  return (
    <ChannelContext.Provider value={store}>
      {props.children}
    </ChannelContext.Provider>
  )
}
