import { Link as RouterLink, type LinkProps } from 'solid-app-router'
import { type JSX } from 'solid-js'

export const Link = (props: LinkProps) => <RouterLink {...props} text="link" />

export const ExternalLink = (
  props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>
) => <a {...props} text="link" target="_blank" rel="noopener noreferrer" />
