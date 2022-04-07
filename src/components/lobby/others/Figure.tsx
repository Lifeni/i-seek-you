import { Link } from 'solid-app-router'
import { RiSystemLock2Fill } from 'solid-icons/ri'
import { Show, type JSX } from 'solid-js'

interface PeerProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  emoji: string
  id: string
  name: string
  password: boolean
}

export const Peer = (props: PeerProps) => (
  <div min-w="20" flex="~ col" items="center" justify="center" gap="3">
    <Link
      role="tooltip"
      aria-label={`${props.password ? '🔒' : ''} ${props.name} #${props.id}`}
      data-position="top"
      href={`/channels/${props.id}`}
      pos="relative"
      w="16 sm:18"
      h="16 sm:18"
      flex="~"
    >
      <span
        flex="~"
        justify="center"
        items="center"
        text="4rem sm:4.5rem center"
        w="16 sm:18"
        h="16 sm:18"
        select="none"
      >
        {props.emoji}
      </span>

      <Show when={props.password}>
        <span
          pos="absolute"
          right="-2"
          bottom="0"
          flex="~"
          justify="center"
          items="center"
          w="8"
          h="8"
          p="2"
          rounded="full"
          bg="light-600 dark:dark-400"
        >
          <RiSystemLock2Fill w="4" h="4" />
        </span>
      </Show>
    </Link>
    <span font="bold" select="none">
      #{props.id}
    </span>
  </div>
)

interface ActionProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  href: string
  name: string | JSX.Element
  tooltip: string
}

export const Action = (props: ActionProps) => (
  <div min-w="20" flex="~ col" items="center" gap="3">
    <Link
      role="tooltip"
      aria-label={props.tooltip}
      data-position="top"
      href={props.href}
      pos="relative"
      w="16 sm:18"
      h="16 sm:18"
      flex="~"
    >
      <span
        w="16 sm:18"
        h="16 sm:18"
        flex="~"
        justify="center"
        items="center"
        bg="light-600 dark:dark-400"
        rounded="full"
        {...props}
      >
        {props.children}
      </span>
    </Link>
    <span font="bold" select="none">
      {props.name}
    </span>
  </div>
)
