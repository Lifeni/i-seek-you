export const Others = () => (
  <div flex="~ 1" items="center" justify="center" z="10">
    <div flex="~ col 1" gap="4" z="20">
      <span text="gray-500 dark:gray-400 center" leading="8">
        Open
        <a
          href="https://i-seek-you.dist.run"
          m="x-2"
          font="bold"
          text="rose-500 hover:underline"
        >
          I Seek You
        </a>
        on another local device or
        <input
          aria-label="Enter a 4-digit ID"
          type="text"
          name="connect-id"
          id="connect-id"
          placeholder="Enter an ID"
          pattern="[0-9]{4}"
          inputMode="numeric"
          maxLength="4"
          class="placeholder-current placeholder:opacity-100"
          w="28"
          m="x-2"
          p="x-2 y-1"
          border="1 transparent rounded-sm hover:rose-500"
          bg="light-600 dark:dark-400"
          text="center"
          ring="focus:4 rose-500"
          transition="border"
          outline="none"
        />
        to connect.
      </span>
    </div>
  </div>
)
