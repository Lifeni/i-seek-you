import { Link } from 'solid-app-router'
import { Show, type JSX } from 'solid-js'

interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  href: string
  emoji?: string
  id?: string
  name: string
  password?: boolean
  tooltip?: string
}

export const Avatar = (props: AvatarProps) => (
  <div min-w="20" flex="~ col" items="center" gap="2">
    <Link
      role={props.tooltip ? 'tooltip' : undefined}
      aria-label={props.tooltip ? props.tooltip : undefined}
      data-position={props.tooltip ? 'top' : undefined}
      href={props.href}
      w="18"
      h="18"
      flex="~"
    >
      <Show
        when={props.children}
        fallback={
          <span text="4.5rem" select="none">
            {props.emoji}
          </span>
        }
      >
        <span
          w="18"
          h="18"
          flex="~"
          justify="center"
          items="center"
          bg="light-600 dark:dark-400"
          rounded="full"
        >
          {props.children}
        </span>
      </Show>
    </Link>
    <span font="bold" select="none">
      <Show when={props.id} fallback={props.name}>
        {props.id}
      </Show>
    </span>
  </div>
)
