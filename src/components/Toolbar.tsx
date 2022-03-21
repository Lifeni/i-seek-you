import { RiSystemSettingsFill } from 'solid-icons/ri'
import { createSignal, Show } from 'solid-js'
import { Settings } from './modal/Settings'
import { Signal } from './toolbar/Signal'

export const Toolbar = () => {
  const [showSettings, setShowSettings] = createSignal(false)

  return (
    <header
      role="toolbar"
      w="full"
      flex="~"
      justify="between"
      items="center"
      p="x-6 y-6 sm:x-8"
      z="20"
    >
      <div flex="~" justify="start" items="center">
        <Signal />
      </div>
      <div flex="~ 1" justify="center" items="center">
        <h1 text="xl" font="bold" select="none">
          I Seek You
        </h1>
      </div>
      <div flex="~" justify="end" items="center">
        <div class="ui-tips reverse" title="Settings">
          <button
            aria-label="Settings"
            flex="~"
            rounded="full"
            p="3"
            border="none"
            bg="transparent hover:light-500 dark:hover:dark-400"
            onClick={() => setShowSettings(true)}
          >
            <RiSystemSettingsFill
              class="w-6 h-6"
              text="gray-800 dark:gray-300"
            />
          </button>
        </div>

        <Show when={showSettings()}>
          <Settings close={() => setShowSettings(false)} />
        </Show>
      </div>
    </header>
  )
}
