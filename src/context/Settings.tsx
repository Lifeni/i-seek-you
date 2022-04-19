import { Vault } from '@ultimate/vault'
import { debounce } from 'lodash'
import { createContext, untrack, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useServer } from './Server'

type TURN = {
  urls: string
  username: string
  password: string
}

export type Settings = [
  {
    emoji: string
    password: string
    name: string
    signaling: string
    stun: string
    turn: TURN
  },
  {
    setEmoji: (emoji: string, once?: boolean) => void
    setPassword: (password: string) => void
    setName: (name: string) => void
    setSignaling: (signaling: string) => void
    setSTUN: (stun: string) => void
    setTURN: (turn: TURN) => void
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

export const defaultSettings: Settings = [
  {
    emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
    name: '',
    password: '',
    signaling: 'signaling.i-seek-you.dist.run',
    stun: 'stun.i-seek-you.dist.run:7201',
    turn: {
      urls: 'turn.i-seek-you.dist.run:7202',
      username: 'webrtc',
      password: 'webrtc',
    },
  },
  {
    setEmoji: () => {},
    setPassword: () => {},
    setName: () => {},
    setSignaling: () => {},
    setSTUN: () => {},
    setTURN: () => {},
  },
]

export const SettingsContext = createContext<Settings>(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [server] = useServer()
  const storage = new Vault({})

  const read = () =>
    Object.fromEntries(
      Object.entries(storage.value).map(([k, v]) => [k, JSON.parse(v)])
    )

  const [settings, setSettings] = createStore<Settings[0]>({
    ...defaultSettings[0],
    ...read(),
  })

  const write = (name: keyof Settings[0], value: string | TURN) => {
    setSettings(name, () => value)
    if (value) {
      storage.set(name, value)
      if (!['signaling', 'stun', 'turn'].includes(name)) sendMessage()
    } else storage.remove(name)
  }

  const store: Settings = [
    settings,
    {
      setEmoji: (emoji: string) => write('emoji', emoji),
      setPassword: (password: string) => write('password', password),
      setName: (name: string) => write('name', name),
      setSignaling: (signaling: string) => write('signaling', signaling),
      setSTUN: (stun: string) => write('stun', stun),
      setTURN: (turn: TURN) => write('turn', turn),
    },
  ]

  const sendMessage = debounce(() => {
    const data = untrack(() => ({
      name: settings.name,
      password: !!settings.password,
      emoji: settings.emoji,
    }))

    server.websocket?.send('sign', data)
  }, 1000)

  return (
    <SettingsContext.Provider value={store}>
      {props.children}
    </SettingsContext.Provider>
  )
}
