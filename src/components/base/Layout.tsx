import { children, onMount, type JSX } from 'solid-js'

export const Layout = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const elements = children(() => props.children)

  onMount(
    () =>
      (document.documentElement.className =
        localStorage.getItem('theme') || 'dark')
  )

  return (
    <div class="screen" flex="center col" bg="main" text="main" font="sans">
      {elements}
    </div>
  )
}
