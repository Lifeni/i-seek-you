import { useI18n } from '@solid-primitives/i18n'
import { RiSystemCloseFill, RiSystemCheckFill } from 'solid-icons/ri'
import { createSignal, onCleanup, onMount, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import tinykeys from 'tinykeys'
import { Button, CloseButton } from './Button'

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isDanger?: boolean
  isOpen: boolean
  hasTitleBar?: boolean
  hasActionBar?: boolean
  actionText?: string[]
  isBlur?: boolean
  onCancel: () => void
  onConfirm?: () => void
}

export const Modal = (props: ModalProps) => {
  const [t] = useI18n()
  const [shake, setShake] = createSignal(false)
  const [modal, setModal] = createSignal<HTMLDivElement>()

  const handleClose = () => {
    if (props.isDanger) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } else props.onCancel()
  }

  onMount(() => {
    const target = modal()
    if (!target) return
    const unbind = tinykeys(target, {
      Escape: handleClose,
      Enter: () => props.onConfirm?.(),
    })
    onCleanup(() => unbind())
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
        p="4 b-12 sm:b-4"
        flex="~"
        display={props.isOpen ? 'visible' : 'invisible'}
        opacity={props.isOpen ? '100' : '0'}
        items={props.size === 'lg' ? 'start sm:center' : 'center'}
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
              ? '64'
              : props.size === 'sm'
              ? '72'
              : props.size === 'md'
              ? '80'
              : props.size === 'lg'
              ? '180'
              : 'unset'
          }
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          rounded="md"
          shadow="2xl"
          transform={props.isOpen ? '~ scale-100' : '~ scale-96'}
          transition="transform ease-out"
          animate={shake() ? 'headShake duration-0.75s' : ''}
          tabIndex={props.isOpen ? '1' : '-1'}
        >
          <Show when={props.hasTitleBar}>
            <div w="full" p="x-3 t-2" flex="~" items="center">
              <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
                {props.name}
              </h1>
              <CloseButton
                isFocus={props.isOpen && !props.isBlur}
                isDanger={!!props.isDanger}
                onClick={() => props.onCancel()}
              />
            </div>
          </Show>
          {props.children}
          <Show when={props.hasActionBar}>
            <div w="full" p="x-4 b-4" flex="~" items="center" gap="3">
              <Button
                icon={RiSystemCloseFill}
                isFocus={props.isOpen && !props.isBlur && !props.onConfirm}
                onClick={() => props.onCancel()}
              >
                {props.actionText?.[0] || t('cancel')}
              </Button>
              <Show when={props.onConfirm}>
                <Button
                  icon={RiSystemCheckFill}
                  isFocus={props.isOpen && !props.isBlur && !!props.onConfirm}
                  isPrimary
                  onClick={() => props.onConfirm?.()}
                >
                  {props.actionText?.[1] || t('confirm')}
                </Button>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </Portal>
  )
}
