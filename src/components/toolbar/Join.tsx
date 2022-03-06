const Join = () => (
  <div
    px="4"
    display="flex"
    items="center"
    justify="center"
    flex="1"
    border="1 light-800 dark:dark-800"
    text="secondary focus-within:rose-500"
    bg="secondary"
    rounded="sm"
    focus-within="ring-auto"
    gap="4"
  >
    <span class="i-ic-round-add-circle" w="6" h="6" text="inherit"></span>
    <input
      type="text"
      w="full"
      py="2"
      border="none"
      text="primary base"
      font="sans"
      bg="secondary"
      rounded="sm"
      focus="outline-none"
      placeholder="Enter a Connection ID"
    />
  </div>
)

export { Join }
