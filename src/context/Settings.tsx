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
    e2ee: boolean
  },
  {
    setEmoji: (emoji: string, once?: boolean) => void
    setPassword: (password: string) => void
    setName: (name: string) => void
    setSignaling: (signaling: string) => void
    setSTUN: (stun: string) => void
    setTURN: (turn: TURN) => void
    setE2EE: (e2ee: boolean) => void
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
    stun: 'stun.i-seek-you.dist.run',
    turn: {
      urls: 'turn.i-seek-you.dist.run',
      username: 'webrtc',
      password: 'webrtc',
    },
    e2ee: true,
  },
  {
    setEmoji: () => {},
    setPassword: () => {},
    setName: () => {},
    setSignaling: () => {},
    setSTUN: () => {},
    setTURN: () => {},
    setE2EE: () => {},
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

  const write = (name: keyof Settings[0], value: boolean | string | TURN) => {
    setSettings(name, () => value)
    if (value !== '') {
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
      setE2EE: (e2ee: boolean) => write('e2ee', e2ee),
    },
  ]

  const sendMessage = debounce(() => {
    const data = untrack(() => ({
      name: settings.name,
      password: !!settings.password,
      e2ee: settings.e2ee,
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
