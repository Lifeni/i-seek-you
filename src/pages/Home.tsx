import { Outlet } from 'solid-app-router'
import { batch, onMount, type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { version } from '../../package.json'
import { Others } from '../components/lobby/Others'
import { Request } from '../components/lobby/Request'
import { You } from '../components/lobby/You'
import { Server } from '../components/toolbar/Server'
import { Settings } from '../components/toolbar/Settings'
import { useNavigate } from 'solid-app-router'
import { type WsType } from '../../index.d'
import { useChannel } from '../context/Channel'
import { useSettings } from '../context/Settings'
import { useConnection } from '../context/Connection'

const Home: Component = () => {
  const [settings] = useSettings()
  const navigate = useNavigate()
  const [
    connection,
    {
      sendWebSocket,
      setStatus,
      setId,
      setPeers,
      setWebSocket,
      setPing,
      resetConnection,
    },
  ] = useConnection()
  const [
    channel,
    { setPeer, setMode, setSignal, setConfirm, setError, resetChannel },
  ] = useChannel()

  onMount(() => {
    const ws = new WebSocket(settings.server)
    setWebSocket(ws)
    let start = new Date().getTime()

    ws.addEventListener('open', () => {
      sendWebSocket('sign', {
        name: settings.name,
        password: !!settings.password,
        emoji: settings.emoji,
      })
      sendWebSocket('ping')
      setInterval(() => {
        start = new Date().getTime()
        sendWebSocket('ping')
      }, 5000)
    })

    ws.addEventListener('message', (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'pong': {
          const end = new Date().getTime()
          setPing(end - start)
          break
        }
        case 'id': {
          const { id } = data as WsType['Id']
          setId(id)
          setStatus('connected')
          break
        }
        case 'peer': {
          const { peer } = data as WsType['Peer']
          if (peer.password) setSignal('auth')
          else setSignal('call')
          setPeer(peer)
          break
        }
        case 'lobby': {
          const { peers } = data as WsType['Lobby']
          const lobby = peers.filter(peer => peer.id !== connection.id)
          setPeers(lobby)
          break
        }
        case 'call': {
          const { peer, password } = data as WsType['Call']
          if (!settings.password || password === settings.password) {
            if (channel.signal === 'idle') {
              setConfirm(true)
              setPeer(peer)
            } else
              sendWebSocket('error', {
                id: peer.id,
                message: 'Peer is Busy',
              })
          } else
            sendWebSocket('error', {
              id: peer.id,
              message: 'Authentication Failed',
            })
          break
        }
        case 'disconnect': {
          resetChannel()
          navigate('/')
          break
        }
        case 'answer': {
          // TODO: send sdp and ice
          batch(() => {
            setSignal('connecting')
            setMode('message')
          })
          break
        }
        case 'error': {
          const { message } = data as WsType['Error']
          batch(() => {
            setError(message)
            setMode('other')
            setSignal('error')
          })
          break
        }
      }
    })

    ws.addEventListener('closed', () => {
      resetConnection('closed')
      resetChannel()
      navigate('/')
    })

    ws.addEventListener('error', () => {
      resetConnection('error')
      resetChannel()
      navigate('/')
    })
  })

  return (
    <>
      <Title>I Seek You</Title>

      <header
        role="toolbar"
        pos="relative"
        w="full"
        flex="~"
        justify="between"
        items="center"
        p="x-6 y-6 sm:x-8"
        z="20"
      >
        <Server />
        <Heading />
        <Settings />
      </header>

      <main flex="~ col 1" p="8">
        <Others />
        <You />
        <Request />
      </main>

      <Outlet />
    </>
  )
}

const Heading = () => (
  <h1
    role="tooltip"
    aria-label={`I Seek You ${version} ︱ View on GitHub`}
    data-position="bottom"
    text="xl"
    font="bold"
    select="none"
  >
    <a
      href="https://github.com/Lifeni/i-seek-you"
      target="_blank"
      rel="noopener noreferrer"
      text="hover:underline"
    >
      I Seek You
    </a>
  </h1>
)

export default Home
