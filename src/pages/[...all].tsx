import type { Component } from 'solid-js'
import { MetaProvider, Title } from 'solid-meta'

const NotFound: Component = () => {
  return (
    <div
      w="screen"
      h="screen"
      display="flex"
      items="center"
      justify="center"
      bg="white dark:dark-800"
      text="black dark:light-800"
      select="none"
    >
      <Title>404 Not Found</Title>
      <h1 text="xl" font="sans normal">
        <code font="sans bold">404</code>
        <span mx="4">|</span>
        <span>Not Found</span>
      </h1>
    </div>
  )
}

export default NotFound
