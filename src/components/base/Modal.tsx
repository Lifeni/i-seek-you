import { RiSystemCloseFill } from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import tinykeys from 'tinykeys'

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isCloseable?: boolean
  isOpen: boolean
  onClose: () => void
}

export const Modal = (props: ModalProps) => {
  const [shake, setShake] = createSignal(false)
  let modal: HTMLDivElement, close: HTMLButtonElement

  const handleClose = () => {
    if (props.isCloseable) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    props.onClose()
  }

  createEffect(() => {
    if (close && props.isOpen) setTimeout(() => close.focus(), 200)
  })

  onMount(() => {
    if (modal) {
      const unbind = tinykeys(modal, { Escape: handleClose })
      onCleanup(() => unbind())
    }
  })

  return (
    <Portal>
      <div
        ref={el => (modal = el)}
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
          onClick={handleClose}
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
          transition="transform ease-out"
          animate={shake() ? 'headShake duration-0.75s' : ''}
          tabIndex={props.isOpen ? '1' : '-1'}
        >
          <Show when={props.title}>
            <div w="full" m="b-3" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.title}
              </h1>

              <button
                ref={el => (close = el)}
                role="tooltip"
                aria-label={props.isCloseable ? 'Disconnect' : 'Close'}
                data-position="top"
                flex="~"
                rounded="full"
                p="3"
                border="none"
                text={
                  props.isCloseable
                    ? 'inherit hover:(light-100 dark:light-600)'
                    : 'inherit'
                }
                bg={
                  props.isCloseable
                    ? 'transparent hover:rose-500'
                    : 'transparent hover:light-600 dark:hover:dark-400'
                }
                onClick={handleClose}
              >
                <RiSystemCloseFill w="6" h="6" />
              </button>
            </div>
          </Show>
          <div flex="~ col" gap="3">
            {props.children}
          </div>
        </div>
      </div>
    </Portal>
  )
}
