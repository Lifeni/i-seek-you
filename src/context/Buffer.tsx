import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

export type Message = {
  type: 'text' | 'image' | 'file' | 'screen' | 'video' | 'audio' | 'unknown'
  date: string
  from: string
  content: string
}

export type Buffer = [
  { messages: Readonly<Message[]> },
  {
    addMessage: (message: Message) => void
    resetBuffer: () => void
  }
]

const defaultBuffer: Buffer = [
  { messages: [] },
  {
    addMessage: () => {},
    resetBuffer: () => {},
  },
]

export const BufferContext = createContext<Buffer>(defaultBuffer)

export const useBuffer = () => useContext(BufferContext)

export const BufferProvider = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [buffer, setBuffer] = createStore<Buffer[0]>({
    ...defaultBuffer[0],
  })

  const store: Buffer = [
    buffer,
    {
      addMessage(message: Message) {
        setBuffer('messages', messages => [...messages, message])
      },
      resetBuffer: () => setBuffer({ messages: [] }),
    },
  ]

  return (
    <BufferContext.Provider value={store}>
      {props.children}
    </BufferContext.Provider>
  )
}
