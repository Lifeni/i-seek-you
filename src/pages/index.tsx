import { type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Dashboard } from '../components/Dashboard'
import { Toolbar } from '../components/Toolbar'

const Home: Component = () => {
  return (
    <div display="screen" flex="center col">
      <Title>I Seek You</Title>
      <Toolbar />
      <Dashboard />
    </div>
  )
}

export default Home
