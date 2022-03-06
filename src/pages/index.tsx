import type { Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Others } from '../components/dashboard/Others'
import { You } from '../components/dashboard/You'
import { Actions } from '../components/toolbar/Actions'
import { Join } from '../components/toolbar/Join'
import { Status } from '../components/toolbar/Status'

const Home: Component = () => {
  return (
    <div display="center screen" bg="primary" text="primary" font="sans">
      <Title>I Seek You</Title>
      <header w="full" display="flex" justify="between" px="9" py="5" gap="8">
        <Status type="success" />
        <Join />
        <Actions />
      </header>
      <main flex="col 1" display="flex" items="center" justify="end" p="8">
        <Others />
        <You />
      </main>
    </div>
  )
}

export default Home
