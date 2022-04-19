import { type IconTypes } from 'solid-icons'
import { RiSystemCloseFill } from 'solid-icons/ri'
import { createEffect, createSignal, Show, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Tooltip } from './Popover'

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconTypes
  isPrimary?: boolean
  isFocus?: boolean
}

export const Button = (props: ButtonProps) => {
  const [button, setButton] = createSignal<HTMLButtonElement>()

  createEffect(() => {
    const target = button()
    if (!target || !props.isFocus) return
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
        props.isPrimary ? 'light-100 dark:light-600' : 'gray-800 dark:gray-300'
      }
      bg={
        props.isPrimary
          ? 'rose-500 hover:(rose-600 dark:rose-400)'
          : 'light-600 dark:dark-400 hover:(light-800 dark:dark-200)'
      }
      cursor={props.disabled ? 'not-allowed' : 'pointer'}
      transition="colors"
      {...props}
    >
      <Show when={props.icon}>
        <Dynamic component={props.icon} w="4.5" h="4.5" />
      </Show>
      <span text="sm" font="bold">
        {props.children}
      </span>
    </button>
  )
}

interface IconButtonProps extends ButtonProps {
  name: string
  size?: 'md' | 'lg'
}

export const IconButton = (props: IconButtonProps) => {
  const [button, setButton] = createSignal<HTMLElement>()

  createEffect(() => {
    const target = button()
    if (!target || !props.isFocus) return
    setTimeout(() => target.focus(), 200)
  })

  return (
    <Tooltip name={props.name}>
      <button
        ref={setButton}
        flex="~"
        items="center"
        justify="center"
        rounded="full"
        w={props.size === 'lg' ? '16 sm:18' : '11'}
        h={props.size === 'lg' ? '16 sm:18' : '11'}
        p="2.5"
        border="none"
        text={
          props.isPrimary
            ? 'light-100 dark:light-600'
            : 'gray-800 dark:gray-300'
        }
        bg={
          props.isPrimary
            ? 'rose-500 hover:(rose-600 dark:rose-400)'
            : 'transparent hover:(light-600 dark:dark-400) active:(light-800 dark:dark-200)'
        }
        cursor={props.disabled ? 'not-allowed' : 'pointer'}
        transition="colors"
        {...props}
      >
        <Show when={props.icon}>
          <Dynamic
            component={props.icon}
            w={props.size === 'lg' ? '7 sm:8' : '5'}
            h={props.size === 'lg' ? '7 sm:8' : '5'}
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
  const [button, setButton] = createSignal<HTMLButtonElement>()

  createEffect(() => {
    const target = button()
    if (!target || !props.isFocus) return
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
          props.isDanger
            ? 'inherit hover:(light-100 dark:light-600)'
            : 'inherit'
        }
        bg={
          props.isDanger
            ? 'transparent hover:rose-500'
            : 'transparent hover:light-600 dark:hover:dark-400'
        }
        {...props}
        transition="colors"
      >
        <RiSystemCloseFill w="6" h="6" />
      </button>
    </Tooltip>
  )
}
