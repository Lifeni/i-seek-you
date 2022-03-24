import { version } from '../../package.json'
import { Server } from './modal/Server'
import { Settings } from './modal/Settings'

export const Toolbar = () => {
  return (
    <header
      role="toolbar"
      w="full"
      flex="~"
      justify="between"
      items="center"
      p="x-6 y-6 sm:x-8"
      z="20"
    >
      <div flex="~" justify="start" items="center">
        <Server />
      </div>
      <div flex="~ 1" justify="center" items="center">
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
      </div>
      <div flex="~" justify="end" items="center">
        <Settings />
      </div>
    </header>
  )
}
