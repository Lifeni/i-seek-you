import { debounce } from 'lodash'
import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useConnection } from './Connection'

export type Settings = [
  {
    emoji: string
    password: string
    name: string
    server: string
  },
  {
    setEmoji: (emoji: string, once?: boolean) => void
    setPassword: (password: string) => void
    setName: (name: string) => void
    setServer: (server: string) => void
  }
]

// prettier-ignore
const emojiList = [
  '😏', '😅', '😎', '🤡', '👽',
  '👾', '🤖', '💩', '💀', '🐵',
  '🐶', '🐺', '🐱', '🦁', '🐯',
  '🦊', '🦝', '🐮', '🐷', '🐭',
  '🐹', '🐰', '🐻', '🐻‍❄️', '🐨',
  '🐼', '🐸', '🐔', '🦀', '🐳',
  '🦐', '🐤', '🦉', '🦚', '🕊️',
  '🐲', '🦄', '🦕', '🐇', '🐙',
  '😂', '😚', '🙃', '🥳', '🧐'
]

const defaultSettings: Settings = [
  {
    emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
    name: 'You',
    password: '',
    server: 'wss://server.i-seek-you.dist.run',
  },
  {
    setEmoji: () => {},
    setPassword: () => {},
    setName: () => {},
    setServer: () => {},
  },
]

export const SettingsContext = createContext<Settings>(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [connection] = useConnection()

  const readStore = () =>
    (Object.keys(defaultSettings[0]) as [keyof Settings[0]]).reduce(
      (pre, cur) => {
        pre[cur] = localStorage.getItem(cur) || defaultSettings[0][cur]
        return pre
      },
      {} as Settings[0]
    )

  const [settings, setSettings] = createStore<Settings[0]>({
    ...defaultSettings[0],
    ...readStore(),
  })

  const writeStore = (
    name: keyof Settings[0],
    value: string,
    once?: boolean
  ) => {
    setSettings(name, () => value)
    if (value && !once) localStorage.setItem(name, value)
    else if (!value) localStorage.removeItem(name)
    if (!once && name !== 'server') sendMessage()
  }

  const store: Settings = [
    settings,
    {
      setEmoji: (emoji: string, once?: boolean) =>
        writeStore('emoji', emoji, once),
      setPassword: (password: string) => writeStore('password', password),
      setName: (name: string) => writeStore('name', name),
      setServer: (server: string) => writeStore('server', server),
    },
  ]

  const sendMessage = debounce(() => {
    const data = untrack(() => ({
      name: settings.name,
      password: !!settings.password,
      emoji: settings.emoji,
    }))
    connection.signaling?.send('sign', data)
  }, 1000)

  return (
    <SettingsContext.Provider value={store}>
      {props.children}
    </SettingsContext.Provider>
  )
}
