import { useI18n } from '@solid-primitives/i18n'
import { cloneDeep } from 'lodash'
import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
  type FileBlob,
  type FileMessage,
  type Peer,
  type TextMessage,
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
    peer: cloneDeep(defaultPeer),
    error: '',
    confirm: false,
    channel: null,
    messages: [],
    files: [],
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
    setProgress: () => {},
    setBlob: () => {},
    addFile: () => {},
    setStreams: () => {},
    resetStreams: () => {},
    resetConnection: () => {},
  },
]

export const ConnectionContext = createContext<Connection>(defaultConnection)

export const useConnection = () => useContext(ConnectionContext)

export const ConnectionProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [t] = useI18n()
  const [server] = useServer()
  const [connection, setConnection] = createStore<Connection[0]>(
    cloneDeep(defaultConnection[0])
  )

  const store: Connection = [
    connection as Connection[0],
    {
      setMode: (mode: Mode) => setConnection('mode', () => mode),
      setSignal: (signal: Signal) => setConnection('signal', () => signal),
      setInfo: (info: string) => {
        if (info) {
          const key = info
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('.', '')
          setConnection('info', () => t(`info_${key}`) || info)
        } else setConnection('info', () => info)
      },
      setError: (error: string) => {
        if (error) {
          const key = error.toLowerCase().replaceAll(' ', '_')
          setConnection('error', () => t(`error_${key}`) || error)
        } else setConnection('error', () => error)
      },
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
      resetStreams: () => setConnection('streams', () => []),
      resetConnection: () => {
        untrack(() => {
          connection.channel?.close()
          connection.media?.close()
        })
        setConnection(cloneDeep(defaultConnection[0]))
      },
    },
  ]

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  )
}
