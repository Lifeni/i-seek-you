import { createContext, createEffect, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Status = 'connected' | 'connecting' | 'closed' | 'error'

type Connection = [
  { id: string; status: Status; ping: number },
  {
    setId: (id: string) => void
    setStatus: (status: Status) => void
    setPing: (ping: number) => void
  }
]

const defaultConnection: Connection = [
  { id: '', status: 'connecting', ping: 0 },
  { setId: () => {}, setStatus: () => {}, setPing: () => {} },
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
    },
  ]

  createEffect(() => console.log(connection.status))

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  )
}
