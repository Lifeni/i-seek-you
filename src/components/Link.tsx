import { Link as RouterLink, type LinkProps } from 'solid-app-router'

export const Link = (props: LinkProps) => (
  <RouterLink {...props} class="text-link" />
)
