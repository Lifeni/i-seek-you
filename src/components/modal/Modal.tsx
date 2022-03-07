import { children, Show, type JSX } from 'solid-js'
import { Tooltip } from '../base/Tooltip'

interface WindowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string
  close: () => void
}

export const Modal = (props: WindowProps) => {
  const elements = children(() => props.children)

  return (
    <div
      class="screen fade-in"
      pos="fixed"
      top="0"
      left="0"
      z="1000"
      p="4"
      flex="center"
      animate="fade-in forwards duration-200ms iteration-1"
    >
      <div
        aria-hidden
        class="screen"
        pos="absolute"
        top="0"
        left="0"
        bg="black opacity-30"
        onClick={props.close}
      />
      <div
        z="1"
        w="full"
        max-w="96"
        bg="main"
        font="sans"
        text="main"
        p="x-6 y-5"
        border="main"
        rounded="md"
        shadow="2xl"
      >
        <Show when={props.title}>
          <div w="full" m="b-6" flex="between">
            <h1 text="xl" m="0">
              {props.title}
            </h1>
            <Tooltip label="Close">
              <button
                aria-label="Close Window"
                class="button i-ic-round-close"
                text="inherit"
                w="6"
                h="6"
                onClick={props.close}
              />
            </Tooltip>
          </div>
        </Show>
        {elements}
      </div>
    </div>
  )
}
