import { cloneDeep } from 'lodash'
import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Controls = {
  camera: boolean
  microphone: boolean
  screen: boolean
}

export type Stream = MediaStream | null | undefined

export type Voice = [
  { controls: Controls; stream: Stream },
  {
    switchControls: (name: keyof Controls) => void
    setStream: (stream: MediaStream | null | undefined) => void
    resetVoice: () => void
  }
]

const defaultVoice: Voice = [
  {
    controls: {
      camera: false,
      microphone: false,
      screen: false,
    },

    stream: null,
  },
  {
    switchControls: () => {},
    setStream: () => {},
    resetVoice: () => {},
  },
]

export const VoiceContext = createContext<Voice>(defaultVoice)

export const useVoice = () => useContext(VoiceContext)

export const VoiceProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [voice, setVoice] = createStore<Voice[0]>(cloneDeep(defaultVoice[0]))

  const store: Voice = [
    voice,
    {
      switchControls: (name: keyof Controls) =>
        setVoice('controls', v => ({ ...v, [name]: !v[name] })),
      setStream: (stream: MediaStream | null | undefined) =>
        setVoice('stream', stream),
      resetVoice: () => setVoice(cloneDeep(defaultVoice[0])),
    },
  ]

  return (
    <VoiceContext.Provider value={store}>
      {props.children}
    </VoiceContext.Provider>
  )
}
