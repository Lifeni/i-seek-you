import { ExternalLink } from '../base/Link'

export const Placeholder = () => (
  <div flex="center col 1" gap="4" z="20">
    <span text="xl light center" leading="8">
      Open
      <ExternalLink href="https://i-seek-you.dist.run" m="x-2" font="bold">
        I Seek You
      </ExternalLink>
      on another local device or
      <input
        aria-label="Enter a 4-digit ID"
        type="number"
        name="connect-id"
        id="connect-id"
        placeholder="Enter an ID"
        pattern="[0-9]{4}"
        class="input placeholder-current placeholder:opacity-100"
        w="32"
        m="x-2"
        p="x-3 y-1.5"
        bg="dark"
        text="secondary focus:primary lg center"
        rounded="sm"
        focus="ring-main"
      />
      to connect.
    </span>
  </div>
)
