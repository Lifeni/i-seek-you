import { createSignal } from 'solid-js'

export const Profile = () => {
  const [name, setName] = createSignal('')

  return (
    <fieldset w="full" p="3">
      <legend text="xs uppercase gray-500 dark:gray-400" font="bold">
        Profile
      </legend>
      <div w="full" flex="~" items="center" gap="6">
        <button
          class="ui-tips"
          title="Select Your Emoji"
          font="emoji"
          w="4.5rem"
          flex="~"
          items="center"
          justify="center"
          rounded="full"
          leading="none"
          text="4.5rem"
          before="font-sans"
        >
          🙃
        </button>
        <label flex="~ col 1" gap="3">
          <span flex="~">
            <span flex="1">Your Name</span>
            <span text="gray-500 dark:gray-400">{name().length}/18</span>
          </span>
          <input
            type="text"
            name="device-name"
            maxLength="18"
            placeholder="You"
            w="full"
            flex="~ 1"
            p="x-3 y-2"
            border="1 transparent rounded-sm hover:rose-500"
            text="inherit"
            bg="light-600 dark:dark-400"
            ring="focus:4 rose-500"
            transition="border"
            outline="none"
            value={name()}
            onInput={e => setName((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>
    </fieldset>
  )
}

const Emoji = () => <div></div>
