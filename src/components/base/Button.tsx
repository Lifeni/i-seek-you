import { type IconTypes } from 'solid-icons'
import { RiSystemCloseFill } from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  Show,
  splitProps,
  type JSX,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Tooltip } from './Popover'

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconTypes
  isPrimary?: boolean
  isFocus?: boolean
}

export const Button = (props: ButtonProps) => {
  const [local, others] = splitProps(props, ['icon', 'isPrimary', 'isFocus'])
  const [button, setButton] = createSignal<HTMLButtonElement>()

  createEffect(() => {
    const target = button()
    if (!target || !local.isFocus) return
    setTimeout(() => target.focus(), 200)
  })

  return (
    <button
      ref={setButton}
      flex="~ 1"
      items="center"
      justify="center"
      gap="2"
      rounded="~"
      p="x-3 y-2"
      text={
        local.isPrimary ? 'light-100 dark:light-600' : 'gray-800 dark:gray-300'
      }
      bg={
        local.isPrimary
          ? 'rose-500 hover:(rose-600 dark:rose-400)'
          : 'light-600 dark:dark-400 hover:(light-800 dark:dark-200)'
      }
      cursor={others.disabled ? 'not-allowed' : 'pointer'}
      transition="colors"
      {...others}
    >
      <Show when={local.icon}>
        <Dynamic component={local.icon} w="4.5" h="4.5" />
      </Show>
      <span text="sm" font="bold">
        {others.children}
      </span>
    </button>
  )
}

interface IconButtonProps extends ButtonProps {
  name: string
  size?: 'md' | 'lg'
}

export const IconButton = (props: IconButtonProps) => {
  const [local, others] = splitProps(props, [
    'icon',
    'size',
    'isPrimary',
    'isFocus',
  ])
  const [button, setButton] = createSignal<HTMLElement>()

  createEffect(() => {
    const target = button()
    if (!target || !local.isFocus) return
    setTimeout(() => target.focus(), 200)
  })

  return (
    <Tooltip name={others.name}>
      <button
        ref={setButton}
        flex="~"
        items="center"
        justify="center"
        rounded="full"
        w={local.size === 'lg' ? '16 sm:18' : '11'}
        h={local.size === 'lg' ? '16 sm:18' : '11'}
        p="2.5"
        border="none"
        text={
          local.isPrimary
            ? 'light-100 dark:light-600'
            : 'gray-800 dark:gray-300'
        }
        bg={
          local.isPrimary
            ? 'rose-500 hover:(rose-600 dark:rose-400)'
            : 'transparent hover:(light-600 dark:dark-400) active:(light-800 dark:dark-200)'
        }
        cursor={others.disabled ? 'not-allowed' : 'pointer'}
        transition="colors"
        {...others}
      >
        <Show when={local.icon}>
          <Dynamic
            component={local.icon}
            w={local.size === 'lg' ? '7 sm:8' : '5'}
            h={local.size === 'lg' ? '7 sm:8' : '5'}
            text="inherit"
          />
        </Show>
      </button>
    </Tooltip>
  )
}

interface CloseButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  isDanger?: boolean
  isFocus?: boolean
}

export const CloseButton = (props: CloseButtonProps) => {
  const [local, others] = splitProps(props, ['isDanger', 'isFocus'])
  const [button, setButton] = createSignal<HTMLButtonElement>()

  createEffect(() => {
    const target = button()
    if (!target || !local.isFocus) return
    setTimeout(() => target.focus(), 200)
  })

  return (
    <Tooltip name="Close">
      <button
        ref={setButton}
        flex="~"
        rounded="full"
        w="11"
        h="11"
        p="2.5"
        border="none"
        text={
          local.isDanger
            ? 'inherit hover:(light-100 dark:light-600)'
            : 'inherit'
        }
        bg={
          local.isDanger
            ? 'transparent hover:rose-500'
            : 'transparent hover:light-600 dark:hover:dark-400'
        }
        {...others}
        transition="colors"
      >
        <RiSystemCloseFill w="6" h="6" />
      </button>
    </Tooltip>
  )
}

interface TextButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export const TextButton = (props: TextButtonProps) => (
  <button
    text="sm red-500 dark:red-400 hover:underline"
    p="0"
    border="none"
    bg="transparent"
    font="bold"
    {...props}
  >
    {props.children}
  </button>
)
