import { RiSystemCloseFill } from 'solid-icons/ri'
import { children, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isOpen: boolean
  onClose: () => void
}

export const Modal = (props: ModalProps) => {
  const elements = children(() => props.children)

  return (
    <Portal>
      <div
        aria-hidden={!props.isOpen}
        pos="fixed"
        top="0"
        left="0"
        w="screen"
        h="screen"
        z="1000"
        p="4"
        display={props.isOpen ? 'flex visible' : 'flex invisible'}
        opacity={props.isOpen ? '100' : '0'}
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
          max-w={
            props.size === 'xs'
              ? '75'
              : props.size === 'sm'
              ? '90'
              : props.size === 'md'
              ? '120'
              : props.size === 'lg'
              ? '180'
              : 'unset'
          }
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          p={props.title ? 'x-3 t-2 b-3' : '0'}
          rounded="md"
          shadow="2xl"
          transform={props.isOpen ? '~ scale-100' : '~ scale-96'}
          transition="transform"
        >
          <Show when={props.title}>
            <div w="full" m="b-3" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.title}
              </h1>

              <button
                role="tooltip"
                aria-label="Close"
                data-position="top"
                flex="~"
                rounded="full"
                p="3"
                border="none"
                bg="transparent hover:light-600 dark:hover:dark-400"
                onClick={props.onClose}
              >
                <RiSystemCloseFill class="w-6 h-6" />
              </button>
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
