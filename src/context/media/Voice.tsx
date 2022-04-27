import { cloneDeep } from 'lodash'
import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type Controls = {
  camera: boolean
  microphone: boolean
  screen: boolean
}

export type Stream = MediaStream | null | undefined

type Senders = {
  camera: RTCRtpSender | null | undefined
  microphone: RTCRtpSender | null | undefined
  screen: RTCRtpSender | null | undefined
}

export type Voice = [
  { controls: Controls; stream: Stream; senders: Senders },
  {
    switchControls: (name: keyof Controls) => void
    setStream: (stream: MediaStream | null | undefined) => void
    setSenders: (
      name: keyof Senders,
      sender: RTCRtpSender | null | undefined
    ) => void
    resetSenders: () => void
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
    senders: {
      camera: null,
      microphone: null,
      screen: null,
    },
    stream: null,
  },
  {
    switchControls: () => {},
    setSenders: () => {},
    setStream: () => {},
    resetSenders: () => {},
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
      setSenders: (
        name: keyof Senders,
        sender: RTCRtpSender | null | undefined
      ) => setVoice('senders', v => ({ ...v, [name]: sender })),
      setStream: (stream: MediaStream | null | undefined) =>
        setVoice('stream', stream),
      resetSenders: () =>
        setVoice('senders', cloneDeep(defaultVoice[0].senders)),
      resetVoice: () => setVoice(cloneDeep(defaultVoice[0])),
    },
  ]

  return (
    <VoiceContext.Provider value={store}>
      {props.children}
    </VoiceContext.Provider>
  )
}
