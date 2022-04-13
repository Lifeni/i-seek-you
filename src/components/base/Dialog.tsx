import { RiSystemCheckFill, RiSystemCloseFill } from 'solid-icons/ri'
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

interface DialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
  confirmText?: string
  cancelText?: string
  isOpen: boolean
  onConfirm?: () => void
  onCancel: () => void
  noAction?: boolean
}

export const Dialog = (props: DialogProps) => {
  const [modal, setModal] = createSignal<HTMLDivElement>()
  const [confirm, setConfirm] = createSignal<HTMLButtonElement>()
  const [cancel, setCancel] = createSignal<HTMLButtonElement>()

  createEffect(() => {
    const button = props.onConfirm ? confirm() : cancel()
    if (button && props.isOpen) setTimeout(() => button.focus(), 200)
  })

  onMount(() => {
    const dialog = modal()
    if (dialog) {
      const unbind = tinykeys(dialog, {
        Escape: props.onCancel,
        Enter: () => props.onConfirm?.(),
      })
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
          onClick={() => props.onCancel()}
        />
        <div
          pos="relative"
          w="full"
          max-w="72"
          h="auto"
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          p="x-3 t-2 b-3"
          rounded="md"
          shadow="2xl"
          transform={props.isOpen ? '~ scale-100' : '~ scale-96'}
          transition="transform ease-out"
          tabIndex={props.isOpen ? '1' : '-1'}
        >
          {props.children}

          <section flex="~" p="x-1 b-1" gap="3">
            <button
              ref={setCancel}
              flex="~ 1"
              items="center"
              justify="center"
              gap="2"
              rounded="~"
              p="x-3 y-2"
              bg="light-600 dark:dark-400 active:(light-800 dark:dark-200)"
              cursor="pointer"
              onClick={() => props.onCancel()}
            >
              <RiSystemCloseFill w="5" h="5" text="gray-800 dark:gray-300" />
              <span text="sm" font="bold">
                {props.cancelText || 'Cancel'}
              </span>
            </button>

            <Show when={props.onConfirm}>
              <button
                ref={setConfirm}
                flex="~ 1"
                items="center"
                justify="center"
                gap="2"
                rounded="~"
                p="x-3 y-2"
                text="light-100 dark:light-600"
                bg="rose-500 active:(rose-600 dark:rose-400)"
                cursor="pointer"
                onClick={() => props.onConfirm?.()}
              >
                <RiSystemCheckFill w="5" h="5" />
                <span text="sm " font="bold">
                  {props.confirmText || 'Confirm'}
                </span>
              </button>
            </Show>
          </section>
        </div>
      </div>
    </Portal>
  )
}
