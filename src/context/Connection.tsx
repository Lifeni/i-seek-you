import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Peer } from '../../index.d'

type Status = 'connected' | 'connecting' | 'closed' | 'error'

type Connection = [
  {
    id: string
    status: Status
    ping: number
    peers: readonly Peer[]
    websocket: WebSocket | null
  },
  {
    setId: (id: string) => void
    setStatus: (status: Status) => void
    setPing: (ping: number) => void
    setPeers: (peers: Peer[]) => void
    setWebSocket: (websocket: WebSocket) => void
    sendWebSocket: <T>(type: string, message?: T) => void
    resetConnection: (status: Status) => void
  }
]

const defaultConnection: Connection = [
  { id: '', status: 'connecting', ping: 0, peers: [], websocket: null },
  {
    setId: () => {},
    setStatus: () => {},
    setPing: () => {},
    setPeers: () => {},
    setWebSocket: () => {},
    sendWebSocket: () => {},
    resetConnection: () => {},
  },
]

export const ConnectionContext = createContext<Connection>(defaultConnection)

export const useConnection = () => useContext(ConnectionContext)

export const ConnectionProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [connection, setConnection] = createStore<Connection[0]>({
    ...defaultConnection[0],
  })

  const store: Connection = [
    connection,
    {
      setId: (id: string) => setConnection('id', () => id),
      setStatus: (status: Status) => setConnection('status', () => status),
      setPing: (ping: number) => setConnection('ping', () => ping),
      setPeers: (peers: Peer[]) => setConnection('peers', () => peers),
      setWebSocket: (websocket: WebSocket) =>
        setConnection('websocket', () => websocket),
      sendWebSocket: <T,>(type: string, message?: T) =>
        connection.websocket?.send(JSON.stringify({ type, ...message })),
      resetConnection: status => {
        setConnection({
          id: '',
          status: status,
          ping: 0,
          peers: [],
          websocket: null,
        })
      },
    },
  ]

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  )
}
