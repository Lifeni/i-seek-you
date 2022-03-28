import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Connection = [{ id: string }, { setId: (id: string) => void }]

const defaultConnection: Connection = [
  {
    id: Math.floor(Math.random() * 10_000)
      .toString()
      .padStart(4, '0'),
  },
  { setId: () => {} },
]

export const ConnectionContext = createContext<Connection>(defaultConnection)

export const useConnection = () => useContext(ConnectionContext)

export const ConnectionProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [connection, setConnection] = createStore<Connection[0]>({
    ...defaultConnection[0],
  })

  const store: Connection = [
    connection,
    { setId: (id: string) => setConnection('id', () => id) },
  ]

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  )
}
