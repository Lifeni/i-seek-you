import { children, type JSX } from 'solid-js'

interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = (props: TooltipProps) => {
  const elements = children(() => props.children)

  const position = props.position || 'top'
  const name =
    position === 'bottom'
      ? `left-1/2 top-full -translate-x-1/2 translate-y-3`
      : position === 'left'
      ? `top-1/2 right-full -translate-y-1/2 -translate-x-3`
      : position === 'right'
      ? `top-1/2 left-full -translate-y-1/2 translate-x-3`
      : `left-1/2 bottom-full -translate-x-1/2 -translate-y-3`

  return (
    <div pos="relative" class="group" z="10" flex="center">
      {elements}
      <div
        role="tooltip"
        class={`hide ${name} group-hover:show`}
        pos="absolute"
        p="x-3 y-1.5"
        font="sans normal"
        text="main sm"
        bg="main"
        border="main"
        rounded
        pointer="none"
        whitespace="nowrap"
        shadow="lg"
        transform
      >
        {props.label}
      </div>
    </div>
  )
}
