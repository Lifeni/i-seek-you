import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { type Peer } from '../../index.d'
import { type PeerConnection } from '../networks/PeerConnection'
import { useServer } from './Server'

type Mode = 'message' | 'voice' | 'other'

export type Message = {
  type: 'text' | 'image' | 'file' | 'screen' | 'video' | 'audio' | 'unknown'
  date: string
  from: string
  content: string
}

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
    messages: Readonly<Message[]>
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
    addMessage: (message: Message) => void
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
    info: 'Connecting...',
    id: '',
    peer: defaultPeer,
    error: '',
    confirm: false,
    webrtc: null,
    messages: [],
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
    connection,
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
      addMessage(message: Message) {
        setConnection('messages', messages => [...messages, message])
      },
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
