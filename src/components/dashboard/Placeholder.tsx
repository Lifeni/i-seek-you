import { ExternalLink } from '../Link'

export const Placeholder = () => (
  <div flex="center col 1" gap="4" z="10">
    <span text="xl secondary none">
      Open
      <ExternalLink href="https://i-seek-you.dist.run" mx="2" font="bold">
        I Seek You
      </ExternalLink>
      on another local device or
      <input
        type="number"
        name="connect-id"
        id="connect-id"
        placeholder="Enter an ID"
        class="placeholder-current placeholder-opacity-100"
        w="32"
        mx="2"
        px="3"
        py="1.5"
        bg="secondary"
        border="input"
        font="sans"
        text="secondary focus:primary lg center"
        rounded="sm"
        focus="ring-input"
      />
      to connect.
    </span>
  </div>
)
