import { Outlet } from 'solid-app-router'
import { onMount, type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { version } from '../../package.json'
import { Others } from '../components/lobby/Others'
import { You } from '../components/lobby/You'
import { Server } from '../components/toolbar/Server'
import { Settings } from '../components/toolbar/Settings'
import { useConnection } from '../context/Connection'
import { connect, listen, ping } from '../utils/websocket'

const Home: Component = () => {
  const [, { setId, setStatus }] = useConnection()
  onMount(() => {
    connect()
    ping()
    listen<{ id: string }>('id', data => {
      setId(data.id)
      setStatus('connected')
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
