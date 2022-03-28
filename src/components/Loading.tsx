import { createEffect, createSignal, onMount, useTransition } from 'solid-js'
import Logo from '../assets/logo.svg'

export const Loading = () => {
  return (
    <div
      aria-label="Loading"
      pos="fixed"
      left="0"
      top="0"
      z="10000"
      w="screen"
      h="screen"
      p="12"
      flex="~ col"
      justify="center"
      items="center"
      bg="light-100 dark:dark-800"
      font="sans"
      text="gray-800 dark:gray-300"
      overflow="hidden"
      gap="6"
    >
      <img
        src={Logo}
        alt="I Seek You Logo"
        w="24"
        h="24"
        m="6"
        shadow="2xl"
        rounded="full"
        select="none"
        pointer="none"
        flex="1"
      />

      <span
        aria-label="Loading"
        w="6"
        h="6"
        border="4 light-600 dark:dark-400 !t-rose-500 rounded-full"
        animate="spin"
      />
    </div>
  )
}
