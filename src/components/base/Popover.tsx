import { createSignal, onCleanup, onMount, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import tinykeys from 'tinykeys'

interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  name: string
  position?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'right'
}

export const Tooltip = (props: TooltipProps) => (
  <div
    role="tooltip"
    aria-label={props.name}
    data-position={props.position || 'top'}
    {...props}
  >
    {props.children}
  </div>
)

interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
}

export const Popover = (props: PopoverProps) => {
  const [popover, setPopover] = createSignal<HTMLDivElement>()

  onMount(() => {
    const target = popover()
    if (!target) return
    const unbind = tinykeys(target, { Escape: props.onClose })
    onCleanup(() => unbind())
  })

  return (
    <Portal>
      <div
        ref={setPopover}
        aria-hidden={!props.isOpen}
        pos="fixed"
        top="0"
        left="0"
        z="2000"
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
          bg="transparent"
          onClick={() => props.onClose()}
        />
        <div
          pos="relative"
          w="full"
          h="auto"
          left="0 sm:1/2"
          bottom="0 sm:5vh"
          max-w="100"
          z="1"
          font="sans"
          text="gray-800 dark:gray-300"
          bg="light-100 dark:dark-800"
          rounded="t-md sm:md"
          shadow="2xl"
          transform={
            props.isOpen
              ? '~ scale-100 sm:~ sm:-translate-x-1/2'
              : '~ scale-96 sm:~ sm:-translate-x-1/2'
          }
          transition="transform ease-out"
          tabIndex={props.isOpen ? '1' : '-1'}
          overflow="hidden"
          {...props}
        >
          {props.children}
        </div>
      </div>
    </Portal>
  )
}
