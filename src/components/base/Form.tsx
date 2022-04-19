import { type IconTypes } from 'solid-icons'
import { RiSystemArrowDownSLine } from 'solid-icons/ri'
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type JSX,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import tinykeys from 'tinykeys'

interface FieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  name: string
  icon: IconTypes
}

export const Field = (props: FieldProps) => {
  const [local, others] = splitProps(props, ['icon'])

  return (
    <fieldset w="full" p="3">
      <legend
        flex="~"
        justify="center"
        items="center"
        text="sm gray-500 dark:gray-400"
        font="bold"
        gap="2"
      >
        <Dynamic component={local.icon} w="4.5" h="4.5" />
        <span>{props.name}</span>
      </legend>
      <div w="full" flex="~ col" gap="2" {...others}>
        {props.children}
      </div>
    </fieldset>
  )
}

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  tooltip?: string
  isFocus?: boolean
  onEnter?: () => void
}

export const Input = (props: InputProps) => {
  const [input, setInput] = createSignal<HTMLInputElement>()

  onMount(() => {
    if (!props.onEnter) return
    const target = input()
    if (!target) return
    const unbind = tinykeys(target, { Enter: props.onEnter })
    onCleanup(() => unbind())
  })

  createEffect(() => {
    const target = input()
    if (!target || !props.isFocus) return
    setTimeout(() => target.focus(), 200)
  })

  return (
    <input
      ref={setInput}
      aria-label={props.placeholder}
      w="full"
      flex="~ 1"
      p="x-3 y-1.5"
      border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
      text="inherit"
      bg="light-600 dark:dark-400"
      ring="focus:4 rose-500"
      transition="border"
      cursor="disabled:not-allowed"
      outline="none"
      {...props}
    />
  )
}

interface SwitchProps {
  name: string
  isEnabled: boolean
  onChange: (isEnabled: boolean) => void
}

export const Switch = (props: SwitchProps) => {
  const [isEnabled, setEnabled] = createSignal(false)

  const handleClick = () => {
    const state = !isEnabled()
    setEnabled(state)
    props.onChange(state)
  }

  return (
    <button onClick={handleClick}>
      <div
        pos="relative"
        flex="~"
        items="center"
        w="9"
        h="3.5"
        bg={props.isEnabled ? 'rose-500' : 'light-800 dark:dark-200'}
        rounded="full"
      >
        <span class="sr-only">{props.name}</span>
        <span
          class={props.isEnabled ? 'translate-x-4' : 'translate-x-0'}
          pos="relative"
          w="5"
          h="5"
          flex="~"
          items="center"
          justify="center"
          border={`1 ${
            props.isEnabled ? 'rose-500' : 'light-800 dark:dark-200'
          }`}
          rounded="full"
          bg="white"
          transform="~"
          transition="transform ease"
          shadow="md"
        >
          <span
            w="1.5"
            h="1.5"
            rounded="full"
            bg={props.isEnabled ? 'rose-500' : 'light-800'}
          />
        </span>
      </div>
    </button>
  )
}

interface FoldProps extends JSX.DetailsHtmlAttributes<HTMLDetailsElement> {
  name: string
  description?: string
}

export const Fold = (props: FoldProps) => {
  const [isOpen, setOpen] = createSignal(false)

  return (
    <details w="full">
      <style>{'summary::marker { display: none; content: ""; }'}</style>
      <summary
        w="full"
        text="sm gray-500 dark:gray-400"
        cursor="pointer"
        flex="~"
        items="center"
        gap="2"
        overflow="hidden"
        onClick={() => setOpen(v => !v)}
      >
        <span flex="~" font="bold">
          {props.name}
        </span>
        <span font="normal" w="36" text="truncate">
          {props.description}
        </span>
        <span
          m="l-auto"
          flex="~"
          items="center"
          justify="center"
          transform={isOpen() ? '~ rotate-0' : '~ -rotate-90'}
          transition="transform duration-300"
        >
          <RiSystemArrowDownSLine w="4.5" h="4.5" />
        </span>
      </summary>
      <div w="full" p="t-3 b-1" flex="~ col" gap="2">
        {props.children}
      </div>
    </details>
  )
}
