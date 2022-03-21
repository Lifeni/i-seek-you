import { createSignal, Show } from 'solid-js'
import colors from 'windicss/colors'

export const Password = () => {
  const [enabled, setEnabled] = createSignal(false)
  const [password, setPassword] = createSignal('')

  return (
    <fieldset w="full" p="3">
      <legend text="xs uppercase gray-500 dark:gray-400" font="bold">
        Password
      </legend>
      <div w="full" flex="~ col" gap="3">
        <label flex="~" h="5" items="center">
          <span flex="1">Connection Password</span>
          <input
            type="checkbox"
            name="enable-password"
            is="ui-switch"
            checked={enabled()}
            onInput={e => setEnabled((e.target as HTMLInputElement).checked)}
            class="scale-85 origin-right"
            transform="~"
            style={{
              '--ui-blue': colors.rose[500],
              '--ui-dark-blue': colors.rose[500],
            }}
          />
        </label>

        <Show when={enabled()}>
          <input
            type="text"
            name="device-name"
            maxLength="18"
            placeholder={enabled() ? 'Your Password' : 'Not Enabled'}
            disabled={!enabled()}
            w="full"
            flex="~ 1"
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
