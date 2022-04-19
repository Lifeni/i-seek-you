import {
  Link as SolidLink,
  type LinkProps as SolidLinkProps,
} from 'solid-app-router'
import { IconTypes } from 'solid-icons'
import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  isExternal?: boolean
}

export const Link = (props: LinkProps) => (
  <Dynamic
    component={props.isExternal ? 'a' : SolidLink}
    href={props.href || ''}
    target={props.isExternal ? '_blank' : undefined}
    rel={props.isExternal ? 'noopener noreferrer' : undefined}
    m="x-2"
    text="rose-500 hover:underline"
    font="bold"
    {...props}
  >
    {props.children}
  </Dynamic>
)

interface NavLinkProps extends SolidLinkProps {
  icon: IconTypes
}

export const NavLink = (props: NavLinkProps) => {
  const [local, others] = splitProps(props, ['icon'])

  return (
    <SolidLink
      flex="~"
      rounded="full"
      p="3"
      border="none"
      text="gray-800 dark:gray-300"
      bg="transparent hover:light-600 dark:hover:dark-400"
      {...others}
    >
      <Dynamic component={local.icon} w="6" h="6" text="inherit" />
    </SolidLink>
  )
}

export const Subtle = (
  props: JSX.ParamHTMLAttributes<HTMLParagraphElement>
) => (
  <p text="sm gray-500 dark:gray-400" {...props}>
    {props.children}
  </p>
)
