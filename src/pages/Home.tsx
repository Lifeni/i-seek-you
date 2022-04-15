import { Outlet } from 'solid-app-router'
import { onMount, type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Others } from '../components/lobby/Others'
import { Request } from '../components/lobby/Request'
import { You } from '../components/lobby/You'
import { Heading } from '../components/toolbar/Heading'
import { Server } from '../components/toolbar/Server'
import { Settings } from '../components/toolbar/Settings'
import { useConnection } from '../context/Connection'
import { Signaling } from '../networks/Signaling'

const Home: Component = () => {
  const [, { setSignaling }] = useConnection()
  onMount(() => {
    const signaling = new Signaling()
    setSignaling(signaling)
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

export default Home
