import init from '@lifeni/libsm-js'
import wasm from '@lifeni/libsm-js/libsm_js_bg.wasm?url'
import { Outlet } from 'solid-app-router'
import { Title } from 'solid-meta'
import { onMount, type Component } from 'solid-js'
import { Call } from '../components/lobby/Call'
import { Others } from '../components/lobby/Others'
import { You } from '../components/lobby/You'
import { Heading } from '../components/toolbar/Heading'
import { Server } from '../components/toolbar/Server'
import { Settings } from '../components/toolbar/Settings'
import { useServer } from '../context/Server'
import { Signaling } from '../networks/Signaling'

const Home: Component = () => {
  const [, { setWebSocket }] = useServer()
  onMount(async () => {
    const signaling = new Signaling()
    setWebSocket(signaling)
    await init(wasm).then(lib => lib.start())
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

      <main flex="~ col 1" p="6 b-8 sm:8">
        <Others />
        <You />
        <Call />
      </main>

      <Outlet />
    </>
  )
}

export default Home
