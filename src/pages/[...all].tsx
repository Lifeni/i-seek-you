import { type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Link } from '../components/Link'

const NotFound: Component = () => {
  return (
    <div display="screen" flex="center col">
      <Title>404 Not Found</Title>
      <h1 text="xl" font="normal">
        <code font="sans bold">404</code>
        <span mx="4">|</span>
        <span>Not Found</span>
      </h1>
      <Link href="/">Back to Home</Link>
    </div>
  )
}

export default NotFound
