import { RiSystemCloseFill } from 'solid-icons/ri'
import { children, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'

interface WindowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string
  width?: string
  close: () => void
}

export const Modal = (props: WindowProps) => {
  const elements = children(() => props.children)

  return (
    <Portal>
      <div
        pos="fixed"
        top="0"
        left="0"
        w="screen"
        h="screen"
        z="1000"
        p="4"
        display="flex"
        items="center"
        justify="center"
        animate="fade-in forwards duration-200ms iteration-1"
      >
        <div
          aria-hidden
          pos="absolute"
          top="0"
          left="0"
          w="screen"
          h="screen"
          bg="black opacity-30"
          onClick={props.close}
        />
        <div
          w="full"
          h="auto"
          max-w={props.width || '84'}
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          p="x-3 t-2 b-3"
          rounded="md"
          shadow="2xl"
        >
          <Show when={props.title}>
            <div w="full" m="b-3" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.title}
              </h1>
              <div class="ui-tips" title="Close">
                <button
                  aria-label="Close Window"
                  flex="~"
                  rounded="full"
                  p="3"
                  border="none"
                  bg="transparent hover:light-500 dark:hover:dark-400"
                  onClick={props.close}
                >
                  <RiSystemCloseFill class="w-6 h-6" />
                </button>
              </div>
            </div>
          </Show>
          <div flex="~ col" gap="3">
            {elements}
          </div>
        </div>
      </div>
    </Portal>
  )
}
