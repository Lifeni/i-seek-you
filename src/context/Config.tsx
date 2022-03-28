import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Config = [
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

const defaultConfig: Config = [
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

export const ConfigContext = createContext<Config>(defaultConfig)

export const useConfig = () => useContext(ConfigContext)

export const ConfigProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const readStore = () =>
    (Object.keys(defaultConfig[0]) as [keyof Config[0]]).reduce((pre, cur) => {
      pre[cur] = localStorage.getItem(cur) || defaultConfig[0][cur]
      return pre
    }, {} as Config[0])

  const [config, setConfig] = createStore<Config[0]>({
    ...defaultConfig[0],
    ...readStore(),
  })

  const writeStore = (name: keyof Config[0], value: string, once?: boolean) => {
    setConfig(name, () => value)
    if (value && !once) localStorage.setItem(name, value)
    else if (!value) localStorage.removeItem(name)
  }

  const store: Config = [
    config,
    {
      setEmoji: (emoji: string, once?: boolean) =>
        writeStore('emoji', emoji, once),
      setPassword: (password: string) => writeStore('password', password),
      setName: (name: string) => writeStore('name', name),
      setServer: (server: string) => writeStore('server', server),
    },
  ]

  return (
    <ConfigContext.Provider value={store}>
      {props.children}
    </ConfigContext.Provider>
  )
}
