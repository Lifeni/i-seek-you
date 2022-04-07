import { useConfig } from '../context/Config'
import { useConnection } from '../context/Connection'

let websocket: WebSocket | null = null

export const connect = () => {
  const [config] = useConfig()
  const [, { setStatus }] = useConnection()

  websocket = new WebSocket(config.server)
  websocket.addEventListener('open', () => {
    message('hi', {
      name: config.name,
      password: !!config.password,
      emoji: config.emoji,
    })
    message('ping')
  })
  websocket.addEventListener('closed', () => setStatus('closed'))
  websocket.addEventListener('error', () => setStatus('error'))
}

export const message = <T>(type: string, message?: T) => {
  websocket?.send(JSON.stringify({ type, ...message }))
}

export const listen = <T>(type: string, func: (data: T) => void) => {
  websocket?.addEventListener('message', (e: MessageEvent) => {
    const data = JSON.parse(e.data)
    if (data.type === type) func(data)
  })
}

export const ping = () => {
  const [, { setPing }] = useConnection()
  let start = new Date().getTime()

  setInterval(() => {
    start = new Date().getTime()
    message('ping')
  }, 5000)

  listen('pong', () => {
    const end = new Date().getTime()
    setPing(end - start)
  })
}
