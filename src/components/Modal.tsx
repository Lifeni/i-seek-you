import { RiSystemCloseFill } from 'solid-icons/ri'
import { children, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'

interface WindowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string
  width?: string
  open: boolean
  onClose: () => void
}

export const Modal = (props: WindowProps) => {
  const elements = children(() => props.children)

  return (
    <Portal>
      <div
        aria-hidden={!props.open}
        pos="fixed"
        top="0"
        left="0"
        w="screen"
        h="screen"
        z="1000"
        p="4"
        display={props.open ? 'flex visible' : 'flex invisible'}
        opacity={props.open ? '100' : '0'}
        items="center"
        justify="center"
        transition="visible"
      >
        <div
          aria-hidden
          pos="absolute"
          top="0"
          left="0"
          w="screen"
          h="screen"
          bg="black opacity-30"
          onClick={props.onClose}
        />
        <div
          w="full"
          h="auto"
          max-w={props.width ? props.width : '96'}
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          p="x-3 t-2 b-3"
          rounded="md"
          shadow="2xl"
          transform={props.open ? '~ scale-100' : '~ scale-95'}
          transition="transform"
        >
          <Show when={props.title}>
            <div w="full" m="b-3" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.title}
              </h1>
              <sl-tooltip content="Close">
                <button
                  aria-label="Close Window"
                  flex="~"
                  rounded="full"
                  p="3"
                  border="none"
                  bg="transparent hover:light-600 dark:hover:dark-400"
                  onClick={props.onClose}
                >
                  <RiSystemCloseFill class="w-6 h-6" />
                </button>
              </sl-tooltip>
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
