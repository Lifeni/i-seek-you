import { version } from '../../../package.json'

export const Heading = () => (
  <h1
    role="tooltip"
    aria-label={`I Seek You ${version} ︱ View on GitHub`}
    data-position="bottom"
    text="xl"
    font="bold"
    select="none"
  >
    <a
      href="https://github.com/Lifeni/i-seek-you"
      target="_blank"
      rel="noopener noreferrer"
      text="hover:underline"
    >
      I Seek You
    </a>
  </h1>
)
