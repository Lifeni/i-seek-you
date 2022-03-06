export const Placeholder = () => (
  <div flex="center col 1" gap="4">
    <span text="xl secondary none">
      Open
      <a
        href="https://i-seek-you.dist.run"
        target="_blank"
        mx="2"
        text="link"
        align="middle"
        font="bold"
      >
        I Seek You
      </a>
      on another local device or
      <input
        type="number"
        name="connect-id"
        id="connect-id"
        placeholder="Enter an ID"
        class="placeholder-current"
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
