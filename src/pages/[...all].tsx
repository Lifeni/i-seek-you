import { type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Layout } from '../components/base/Layout'
import { Link } from '../components/base/Link'

const NotFound: Component = () => {
  return (
    <Layout>
      <Title>404 Not Found</Title>
      <h1 text="xl" font="normal">
        <code font="sans bold">404</code>
        <span m="x-4">|</span>
        <span>Not Found</span>
      </h1>
      <Link href="/">Back to Home</Link>
    </Layout>
  )
}

export default NotFound
