import { type Component } from 'solid-js'
import { Title } from 'solid-meta'
import { Link } from '../components/base/Text'

const NotFound: Component = () => {
  return (
    <>
      <Title>404 Not Found</Title>

      <h1 text="xl" font="normal" m="b-3">
        <code font="sans bold">404</code>
        <span m="x-4">|</span>
        <span>Not Found</span>
      </h1>
      <Link href="/">Back to Home</Link>
    </>
  )
}

export default NotFound
