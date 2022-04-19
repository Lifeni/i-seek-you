import { Link } from 'solid-app-router'
import { IconTypes } from 'solid-icons'
import { RiSystemLock2Fill } from 'solid-icons/ri'
import { Show, splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Tooltip } from '../../base/Popover'

interface PeerLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  emoji: string
  id: string
  name: string
  password: boolean
}

export const PeerLink = (props: PeerLinkProps) => (
  <Tooltip name={`${props.password ? '🔒' : ''} ${props.name} #${props.id}`}>
    <div min-w="20" flex="~ col" items="center" justify="center" gap="3">
      <Link
        href={`/channels/${props.id}`}
        pos="relative"
        w="16 sm:18"
        h="16 sm:18"
        flex="~"
        underline="none"
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
            text="gray-800 dark:gray-300"
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
  </Tooltip>
)

interface ActionLinkProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  href: string
  icon: IconTypes
  name: string
  isPrimary?: boolean
}

export const ActionLink = (props: ActionLinkProps) => {
  const [local, others] = splitProps(props, ['icon'])

  return (
    <Tooltip name={props.name}>
      <div min-w="20" flex="~ col" items="center" gap="3">
        <Link
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
            rounded="full"
            text={
              props.isPrimary
                ? 'light-100 dark:light-600'
                : 'gray-800 dark:gray-300'
            }
            bg={
              props.isPrimary
                ? 'rose-500 active:(rose-600 dark:rose-400)'
                : 'light-600 dark:dark-400 active:(light-800 dark:dark-200)'
            }
            {...others}
          >
            <Dynamic
              component={local.icon}
              w="7 sm:8"
              h="7 sm:8"
              text="inherit"
            />
          </span>
        </Link>
        <span font="bold" select="none">
          {props.children}
        </span>
      </div>
    </Tooltip>
  )
}
