import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { type Peer } from '../../index.d'
import { type Signaling } from '../networks/Signaling'

type Status = 'connected' | 'connecting' | 'closed' | 'error'

export type Server = [
  {
    id: string
    status: Status
    ping: number
    websocket: InstanceType<typeof Signaling> | null
    peers: readonly Peer[]
    worker: Worker | null
  },
  {
    setId: (id: string) => void
    setStatus: (status: Status) => void
    setPing: (ping: number) => void
    setWebSocket: (signaling: InstanceType<typeof Signaling>) => void
    setPeers: (peers: Peer[]) => void
    setWorker: (worker: Worker) => void
    resetServer: (status: Status) => void
  }
]

const defaultServer: Server = [
  {
    id: '',
    status: 'connecting',
    ping: 0,
    websocket: null,
    peers: [],
    worker: null,
  },
  {
    setId: () => {},
    setStatus: () => {},
    setPing: () => {},
    setWebSocket: () => {},
    setPeers: () => {},
    setWorker: () => {},
    resetServer: () => {},
  },
]

export const ServerContext = createContext<Server>(defaultServer)

export const useServer = () => useContext(ServerContext)

export const ServerProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [server, setServer] = createStore<Server[0]>({
    ...defaultServer[0],
  })

  const store: Server = [
    server as Server[0],
    {
      setId: (id: string) => setServer('id', () => id),
      setStatus: (status: Status) => setServer('status', () => status),
      setPing: (ping: number) => setServer('ping', () => ping),
      setWebSocket: (websocket: InstanceType<typeof Signaling>) =>
        setServer('websocket', () => websocket),
      setWorker: (worker: Worker) => setServer('worker', () => worker),
      setPeers: (peers: Peer[]) => setServer('peers', () => peers),
      resetServer: status => {
        setServer({
          id: '',
          status: status,
          ping: 0,
          websocket: null,
          peers: [],
        })
      },
    },
  ]

  return (
    <ServerContext.Provider value={store}>
      {props.children}
    </ServerContext.Provider>
  )
}
