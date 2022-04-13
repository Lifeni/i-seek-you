import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Peer } from '../../index.d'
import { useConnection } from './Connection'

type Mode = 'message' | 'voice' | 'other'

type Signal =
  | 'idle'
  | 'auth'
  | 'loading'
  | 'call'
  | 'answer'
  | 'error'
  | 'connecting'

type Channel = [
  {
    mode: Mode
    signal: Signal
    error: string
    id: string
    peer: Peer
    confirm: boolean
  },
  {
    setMode: (mode: Mode) => void
    setSignal: (signal: Signal) => void
    setError: (error: string) => void
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
    id: '',
    peer: defaultPeer,
    error: '',
    confirm: false,
  },
  {
    setMode: () => {},
    setSignal: () => {},
    setError: () => {},
    setId: () => {},
    setPeer: () => {},
    setConfirm: () => {},
    resetChannel: () => {},
  },
]

export const ChannelContext = createContext<Channel>(defaultChannel)

export const useChannel = () => useContext(ChannelContext)

export const ChannelProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [connection, { sendWebSocket }] = useConnection()
  const [channel, setChannel] = createStore<Channel[0]>({
    ...defaultChannel[0],
  })

  const store: Channel = [
    channel,
    {
      setMode: (mode: Mode) => setChannel('mode', () => mode),
      setSignal: (signal: Signal) => setChannel('signal', () => signal),
      setError: (error: string) => setChannel('error', () => error),
      setId: (id: string) => {
        if (id && id !== connection.id && id !== channel.id)
          setChannel('id', () => id)
      },
      setPeer: (peer: Peer) => setChannel('peer', () => peer),
      setConfirm: (confirm: boolean) => setChannel('confirm', () => confirm),
      resetChannel: () => {
        const id = channel.id
        if (id) sendWebSocket('disconnect', { id })
        setChannel(defaultChannel[0])
      },
    },
  ]

  return (
    <ChannelContext.Provider value={store}>
      {props.children}
    </ChannelContext.Provider>
  )
}
