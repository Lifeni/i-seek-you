import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { FileMessage, TextMessage, type Peer } from '../../index.d'
import { type PeerConnection } from '../networks/PeerConnection'
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
    webrtc: InstanceType<typeof PeerConnection> | null
    messages: Array<Message>
    streams: readonly MediaStream[] | null
  },
  {
    setMode: (mode: Mode) => void
    setSignal: (signal: Signal) => void
    setInfo: (info: string) => void
    setError: (error: string) => void
    setWebRTC: (webrtc: InstanceType<typeof PeerConnection>) => void
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
    webrtc: null,
    messages: [],
    streams: null,
  },
  {
    setMode: () => {},
    setSignal: () => {},
    setInfo: () => {},
    setError: () => {},
    setId: () => {},
    setPeer: () => {},
    setConfirm: () => {},
    setWebRTC: () => {},
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
      setWebRTC: (webrtc: InstanceType<typeof PeerConnection>) =>
        setConnection('webrtc', () => webrtc),
      setId: (id: string) =>
        untrack(() => {
          if (id && id !== server.id && id !== connection.id)
            setConnection('id', () => id)
        }),
      setPeer: (peer: Peer) => setConnection('peer', () => peer),
      setConfirm: (confirm: boolean) => setConnection('confirm', () => confirm),
      addMessage: (message: Message) =>
        setConnection('messages', messages => [...messages, message]),
      setStreams: (streams: readonly MediaStream[]) =>
        setConnection('streams', () => streams),
      resetConnection: () => {
        untrack(() => connection.webrtc?.close())
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
