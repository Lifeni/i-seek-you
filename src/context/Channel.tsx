import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type ChannelMode = 'text' | 'voice'

type Channel = [{ mode: ChannelMode }, { setMode: (mode: ChannelMode) => void }]

const defaultChannel: Channel = [{ mode: 'text' }, { setMode: () => {} }]

export const ChannelContext = createContext<Channel>(defaultChannel)

export const useChannel = () => useContext(ChannelContext)

export const ChannelProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [channel, setChannel] = createStore<Channel[0]>({
    ...defaultChannel[0],
  })

  const store: Channel = [
    channel,
    { setMode: (mode: ChannelMode) => setChannel('mode', () => mode) },
  ]

  return (
    <ChannelContext.Provider value={store}>
      {props.children}
    </ChannelContext.Provider>
  )
}
