import { SM2ExchangeA, SM2ExchangeB } from '@lifeni/libsm-js'
import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
  type FileBlob,
  type FileMessage,
  type TextMessage,
  type Peer,
  Keypair as KeyPair,
} from '../../index.d'
import { DataChannel } from '../networks/connection/DataChannel'
import { Media } from '../networks/connection/Media'
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
    files: Array<FileBlob>
    media: InstanceType<typeof Media> | null
    streams: readonly MediaStream[]
    keys: KeyPair | null
    exchange: SM2ExchangeA | SM2ExchangeB | null
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
    addMessage: <T extends Message | Message[]>(message: T) => void
    setProgress: (id: string, progress: number) => void
    setBlob: (id: string, blob: Blob) => void
    addFile: (file: FileBlob | FileBlob[]) => void
    setStreams: (streams: readonly MediaStream[]) => void
    setKeys: (name: keyof KeyPair, value: Uint8Array) => void
    setExchange: (exchange: SM2ExchangeA | SM2ExchangeB | null) => void
    resetStreams: () => void
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
    files: [],
    media: null,
    streams: [],
    keys: null,
    exchange: null,
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
    setProgress: () => {},
    setBlob: () => {},
    addFile: () => {},
    setStreams: () => {},
    setKeys: () => {},
    setExchange: () => {},
    resetStreams: () => {},
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
      addMessage: (message: Message | Message[]) => {
        if (Array.isArray(message))
          setConnection('messages', m => [...m, ...message])
        else setConnection('messages', m => [...m, message])
      },
      setProgress: (id: string, progress: number) =>
        setConnection('files', files =>
          files.map(f => (f.id === id ? { ...f, progress } : f))
        ),
      setBlob: (id: string, blob: Blob) =>
        setConnection('files', files =>
          files.map(f => (f.id === id ? { ...f, blob } : f))
        ),
      addFile: (file: FileBlob | FileBlob[]) => {
        if (Array.isArray(file)) setConnection('files', f => [...f, ...file])
        else setConnection('files', f => [...f, file])
      },
      setMedia: (media: InstanceType<typeof Media> | null) =>
        setConnection('media', () => media),
      setStreams: (streams: readonly MediaStream[]) =>
        setConnection('streams', () => streams),
      setKeys: (name: keyof KeyPair, value: Uint8Array) =>
        setConnection('keys', key => ({ ...key, [name]: value })),
      setExchange: (exchange: SM2ExchangeA | SM2ExchangeB | null) =>
        setConnection('exchange', () => exchange),
      resetStreams: () => setConnection('streams', () => []),
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
