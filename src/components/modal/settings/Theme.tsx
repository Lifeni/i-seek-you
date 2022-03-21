import {
  RiSystemCheckFill,
  RiWeatherMoonFill,
  RiWeatherSunFill,
} from 'solid-icons/ri'
import { createSignal, For, Match, onMount, Show, Switch } from 'solid-js'

export const Theme = () => {
  const [theme, setTheme] = createSignal('dark')

  onMount(() => setTheme(localStorage.getItem('theme') || 'dark'))

  const handleTheme = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value
    setTheme(value)
    localStorage.setItem('theme', value)
    document.documentElement.className = value
  }

  return (
    <fieldset w="full" p="3">
      <legend text="xs uppercase gray-500 dark:gray-400" font="bold">
        Theme
      </legend>
      <div w="full" flex="~" gap="3" grid="~ cols-2">
        <For each={['dark', 'light']}>
          {item => (
            <label
              flex="~"
              p="x-3.5 y-2.5"
              border="1 transparent rounded-sm hover:rose-500"
              transition="border"
              text={theme() === item ? 'light-600' : 'inherit'}
              bg={theme() === item ? 'rose-500' : 'light-600 dark:dark-400'}
              cursor="pointer"
            >
              <input
                type="radio"
                name="theme"
                checked={theme() === item}
                value={item}
                onInput={handleTheme}
                hidden
              />
              <span w="full" flex="~" items="center">
                <Switch>
                  <Match when={item === 'dark'}>
                    <RiWeatherMoonFill />
                  </Match>
                  <Match when={item === 'light'}>
                    <RiWeatherSunFill />
                  </Match>
                </Switch>
                <span flex="~ 1" m="x-2" text="capitalize sm" font="bold">
                  {item}
                </span>
                <Show when={theme() === item}>
                  <RiSystemCheckFill w="5" h="5" />
                </Show>
              </span>
            </label>
          )}
        </For>
      </div>
    </fieldset>
  )
}
