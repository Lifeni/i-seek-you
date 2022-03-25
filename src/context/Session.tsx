import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Session = [{ id: string }, { setId: (id: string) => void }]

const defaultSession: Session = [
  {
    id: Math.floor(Math.random() * 10_000)
      .toString()
      .padStart(4, '0'),
  },
  { setId: () => {} },
]

export const SessionContext = createContext<Session>(defaultSession)

export const useSession = () => useContext(SessionContext)

export const SessionProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [session, setSession] = createStore<Session[0]>({
    ...defaultSession[0],
  })

  const store: Session = [
    session,
    { setId: (id: string) => setSession('id', () => id) },
  ]

  return (
    <SessionContext.Provider value={store}>
      {props.children}
    </SessionContext.Provider>
  )
}
