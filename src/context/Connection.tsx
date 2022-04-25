import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { FileMessage, TextMessage, type Peer } from '../../index.d'
import { DataChannel } from '../networks/peer-connection/DataChannel'
import { Media } from '../networks/peer-connection/Media'
import { useServer } from './Server'

type Mode = 'message' | 'voice' | 'other'

type Message = TextMessage | FileMessage

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

export type Connection = [
  {
    mode: Mode
    signal: Signal
    info: string
    error: string
    id: string
    peer: Peer
    confirm: boolean
    channel: InstanceType<typeof DataChannel> | null
    messages: Array<Message>
    media: InstanceType<typeof Media> | null
    streams: readonly MediaStream[]
  },
  {
    setMode: (mode: Mode) => void
    setSignal: (signal: Signal) => void
    setInfo: (info: string) => void
    setError: (error: string) => void
    setChannel: (channel: InstanceType<typeof DataChannel>) => void
    setMedia: (media: InstanceType<typeof Media> | null) => void
    setId: (id: string) => void
    setPeer: (peer: Peer) => void
    setConfirm: (confirm: boolean) => void
    addMessage: <T extends Message>(message: T) => void
    setStreams: (streams: readonly MediaStream[]) => void
    resetConnection: () => void
  }
]

const defaultPeer: Peer = {
  id: '',
  emoji: '',
  name: '',
  password: false,
}

const defaultConnection: Connection = [
  {
    mode: 'other',
    signal: 'idle',
    info: 'Waiting...',
    id: '',
    peer: defaultPeer,
    error: '',
    confirm: false,
    channel: null,
    messages: [],
    media: null,
    streams: [],
  },
  {
    setMode: () => {},
    setSignal: () => {},
    setInfo: () => {},
    setError: () => {},
    setId: () => {},
    setPeer: () => {},
    setConfirm: () => {},
    setChannel: () => {},
    setMedia: () => {},
    addMessage: () => {},
    setStreams: () => {},
    resetConnection: () => {},
  },
]

export const ConnectionContext = createContext<Connection>(defaultConnection)

export const useConnection = () => useContext(ConnectionContext)

export const ConnectionProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [server] = useServer()
  const [connection, setConnection] = createStore<Connection[0]>({
    ...defaultConnection[0],
  })

  const store: Connection = [
    connection as Connection[0],
    {
      setMode: (mode: Mode) => setConnection('mode', () => mode),
      setSignal: (signal: Signal) => setConnection('signal', () => signal),
      setInfo: (info: string) => setConnection('info', () => info),
      setError: (error: string) => setConnection('error', () => error),
      setChannel: (channel: InstanceType<typeof DataChannel>) =>
        setConnection('channel', () => channel),
      setId: (id: string) =>
        untrack(() => {
          if (id && id !== server.id && id !== connection.id)
            setConnection('id', () => id)
        }),
      setPeer: (peer: Peer) => setConnection('peer', () => peer),
      setConfirm: (confirm: boolean) => setConnection('confirm', () => confirm),
      addMessage: (message: Message) =>
        setConnection('messages', messages => [...messages, message]),
      setMedia: (media: InstanceType<typeof Media> | null) =>
        setConnection('media', () => media),
      setStreams: (streams: readonly MediaStream[]) =>
        setConnection('streams', () => streams),
      resetConnection: () => {
        untrack(() => {
          connection.channel?.close()
          connection.media?.close()
        })
        setConnection({ ...defaultConnection[0] })
      },
    },
  ]

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  )
}
