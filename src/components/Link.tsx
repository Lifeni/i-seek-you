import type { LinkProps } from 'solid-app-router'
import { Link as RouterLink } from 'solid-app-router'

const Link = ({ ...props }: LinkProps) => (
  <RouterLink {...props} class="text-link" />
)

export { Link }
