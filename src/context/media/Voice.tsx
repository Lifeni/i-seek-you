import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Controls = {
  camera: boolean
  microphone: boolean
  screen: boolean
  picture: boolean
}

export type Voice = [
  { controls: Controls },
  {
    switchControls: (controls: keyof Controls) => void
    resetVoice: () => void
  }
]

const defaultVoice: Voice = [
  {
    controls: {
      camera: false,
      microphone: false,
      screen: false,
      picture: false,
    },
  },
  {
    switchControls: () => {},
    resetVoice: () => {},
  },
]

export const VoiceContext = createContext<Voice>(defaultVoice)

export const useVoice = () => useContext(VoiceContext)

export const VoiceProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [voice, setVoice] = createStore<Voice[0]>({
    ...defaultVoice[0],
  })

  const store: Voice = [
    voice,
    {
      switchControls: (controls: keyof Controls) =>
        setVoice('controls', v => ({ ...v, [controls]: !v[controls] })),
      resetVoice: () =>
        setVoice('controls', () => ({
          camera: false,
          microphone: false,
          screen: false,
          picture: false,
        })),
    },
  ]

  return (
    <VoiceContext.Provider value={store}>
      {props.children}
    </VoiceContext.Provider>
  )
}
