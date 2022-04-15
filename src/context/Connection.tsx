import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Peer } from '../../index.d'
import { type Signaling } from '../networks/Signaling'

type Status = 'connected' | 'connecting' | 'closed' | 'error'

export type Connection = [
  {
    id: string
    status: Status
    ping: number
    peers: readonly Peer[]
    signaling: InstanceType<typeof Signaling> | null
  },
  {
    setId: (id: string) => void
    setStatus: (status: Status) => void
    setPing: (ping: number) => void
    setPeers: (peers: Peer[]) => void
    setSignaling: (signaling: InstanceType<typeof Signaling>) => void
    resetConnection: (status: Status) => void
  }
]

const defaultConnection: Connection = [
  { id: '', status: 'connecting', ping: 0, peers: [], signaling: null },
  {
    setId: () => {},
    setStatus: () => {},
    setPing: () => {},
    setPeers: () => {},
    setSignaling: () => {},
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
      setSignaling: (signaling: InstanceType<typeof Signaling>) =>
        setConnection('signaling', () => signaling),
      resetConnection: status => {
        setConnection({
          id: '',
          status: status,
          ping: 0,
          peers: [],
          signaling: null,
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
