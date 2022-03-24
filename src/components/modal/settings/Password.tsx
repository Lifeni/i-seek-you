import { Toggle } from 'solid-headless'
import { RiOthersDoorLockFill } from 'solid-icons/ri'
import { createSignal, Show } from 'solid-js'

export const Password = () => {
  const [enabled, setEnabled] = createSignal(false)
  const [password, setPassword] = createSignal('')

  return (
    <fieldset w="full" p="3">
      <legend
        flex="~"
        items="center"
        text="sm gray-500 dark:gray-400"
        font="bold"
        gap="2"
      >
        <RiOthersDoorLockFill w="4" h="4" /> Password
      </legend>
      <div w="full" flex="~ col" gap="2">
        <label for="connection-password" flex="~" items="center">
          <span flex="1">Connection Password</span>
          <Toggle
            pressed={enabled()}
            onChange={e => setEnabled(e)}
            class="w-9 h-3.5"
            pos="relative"
            bg={enabled() ? 'rose-500' : 'light-800 dark:dark-200'}
            flex="~"
            items="center"
            rounded="full"
          >
            <span class="sr-only">Enable Password</span>
            <span
              class={enabled() ? 'translate-x-4' : 'translate-x-0'}
              pos="relative"
              w="5"
              h="5"
              flex="~"
              border={`1 ${enabled() ? 'rose-500' : 'light-800 dark:dark-200'}`}
              rounded="full"
              bg="white"
              transform="~"
              transition="transform"
              shadow="md"
            />
          </Toggle>
        </label>

        <Show when={enabled()}>
          <input
            id="connection-password"
            type="text"
            name="connection-password"
            maxLength="18"
            placeholder={enabled() ? 'Your Password' : 'Not Enabled'}
            disabled={!enabled()}
            flex="~ 1"
            m="y-1"
            p="x-3 y-2"
            border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
            text="inherit"
            bg="light-600 dark:dark-400"
            ring="focus:4 rose-500"
            transition="border"
            cursor="disabled:not-allowed"
            outline="none"
            value={password()}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
          />
        </Show>

        <p text="sm gray-500 dark:gray-400">
          When the password is enabled, others will need to enter it for
          authentication when they connect to your device.
          <a
            href="https://github.com/Lifeni/i-seek-you/#password"
            target="_blank"
            rel="noopener noreferrer"
            m="x-2"
            text="rose-500 hover:underline"
            font="bold"
          >
            Learn more
          </a>
        </p>
      </div>
    </fieldset>
  )
}
