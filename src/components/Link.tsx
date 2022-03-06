import type { LinkProps } from 'solid-app-router'
import { Link as RouterLink } from 'solid-app-router'

export const Link = ({ ...props }: LinkProps) => (
  <RouterLink {...props} class="text-link" />
)
