const Join = () => (
  <div
    px="4"
    display="flex"
    items="center"
    justify="center"
    flex="1"
    border="primary"
    text="secondary focus-within:rose-500"
    bg="secondary"
    rounded="1"
    focus-within="ring-auto"
    gap="4"
  >
    <label
      for="join"
      class="i-ic-round-add-circle"
      w="6"
      h="6"
      text="inherit"
      pointer="none"
    >
      Join Connection
    </label>
    <input
      id="join"
      type="number"
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
