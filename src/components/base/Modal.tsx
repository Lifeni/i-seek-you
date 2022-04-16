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
  isUncloseable?: boolean
  isOpen: boolean
  onClose: () => void
}

export const Modal = (props: ModalProps) => {
  const [shake, setShake] = createSignal(false)
  const [modal, setModal] = createSignal<HTMLDivElement>()
  const [close, setClose] = createSignal<HTMLButtonElement>()

  const handleClose = () => {
    if (props.isUncloseable) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } else {
      props.onClose()
    }
  }

  createEffect(() => {
    const button = close()
    if (button && props.isOpen) setTimeout(() => button.focus(), 200)
  })

  onMount(() => {
    const dialog = modal()
    if (dialog) {
      const unbind = tinykeys(dialog, { Escape: handleClose })
      onCleanup(() => unbind())
    }
  })

  return (
    <Portal>
      <div
        ref={setModal}
        aria-hidden={!props.isOpen}
        pos="fixed"
        top="0"
        left="0"
        z="1000"
        w="screen"
        h="screen"
        p="4"
        flex="~"
        display={props.isOpen ? 'visible' : 'invisible'}
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
          pos="relative"
          w="full"
          h="auto"
          max-w={
            props.size === 'xs'
              ? '72'
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
            <div w="full" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.title}
              </h1>

              <button
                ref={setClose}
                role="tooltip"
                aria-label={props.isUncloseable ? 'Disconnect' : 'Close'}
                data-position="top"
                flex="~"
                rounded="full"
                w="11"
                h="11"
                p="2.5"
                border="none"
                text={
                  props.isUncloseable
                    ? 'inherit hover:(light-100 dark:light-600)'
                    : 'inherit'
                }
                bg={
                  props.isUncloseable
                    ? 'transparent hover:rose-500'
                    : 'transparent hover:light-600 dark:hover:dark-400'
                }
                onClick={() => props.onClose()}
              >
                <RiSystemCloseFill w="6" h="6" />
              </button>
            </div>
          </Show>
          {props.children}
        </div>
      </div>
    </Portal>
  )
}
