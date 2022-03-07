import { type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Layout } from '../components/base/Layout'
import { Dashboard } from '../components/Dashboard'
import { Toolbar } from '../components/Toolbar'

const Home: Component = () => {
  return (
    <Layout>
      <Title>I Seek You</Title>
      <Toolbar />
      <Dashboard />
    </Layout>
  )
}

export default Home
