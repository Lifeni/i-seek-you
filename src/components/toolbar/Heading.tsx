import { Tooltip } from '../base/Popover'
import { Link } from '../base/Text'

export const Heading = () => (
  <Tooltip name="GitHub" position="bottom">
    <h1 text="xl" font="bold" select="none">
      <Link
        href="https://github.com/Lifeni/i-seek-you"
        isExternal
        text="no-underline inherit hover:underline"
      >
        I Seek You
      </Link>
    </h1>
  </Tooltip>
)
