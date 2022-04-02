import { useNavigate } from 'solid-app-router'
import { Toggle } from 'solid-headless'
import { RiOthersDoorLockFill } from 'solid-icons/ri'
import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import tinykeys from 'tinykeys'
import { useConfig } from '../../../context/Config'

export const Password = () => {
  const [config, { setPassword }] = useConfig()
  const [enabled, setEnabled] = createSignal(!!config.password)

  const handleToggle = () => {
    setEnabled(stat => !stat)
    if (!enabled()) setPassword('')
  }

  const navigate = useNavigate()
  const [input, setInput] = createSignal<HTMLInputElement>()

  onMount(() => {
    const el = input()
    if (el && enabled()) {
      const unbind = tinykeys(el, { Enter: () => navigate('/') })
      onCleanup(() => unbind())
    }
  })

  return (
    <fieldset w="full" p="3">
      <legend
        flex="~"
        justify="center"
        items="center"
        text="sm gray-500 dark:gray-400"
        font="bold"
        gap="2"
      >
        <RiOthersDoorLockFill w="4.5" h="4.5" />
        Password
      </legend>
      <div w="full" flex="~ col" gap="2">
        <label for="connection-password" flex="~" items="center">
          <span flex="1">Connection Password</span>
          <Toggle pressed={enabled()} onChange={handleToggle}>
            <div
              pos="relative"
              flex="~"
              items="center"
              w="9"
              h="3.5"
              bg={enabled() ? 'rose-500' : 'light-800 dark:dark-200'}
              rounded="full"
            >
              <span class="sr-only">Enable Password</span>
              <span
                class={enabled() ? 'translate-x-4' : 'translate-x-0'}
                pos="relative"
                w="5"
                h="5"
                flex="~"
                items="center"
                justify="center"
                border={`1 ${
                  enabled() ? 'rose-500' : 'light-800 dark:dark-200'
                }`}
                rounded="full"
                bg="white"
                transform="~"
                transition="transform ease"
                shadow="md"
              >
                <span
                  w="1.5"
                  h="1.5"
                  rounded="full"
                  bg={enabled() ? 'rose-500' : 'light-800'}
                />
              </span>
            </div>
          </Toggle>
        </label>

        <Show when={enabled()}>
          <input
            ref={setInput}
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
            value={config.password}
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
            Learn More
          </a>
        </p>
      </div>
    </fieldset>
  )
}
