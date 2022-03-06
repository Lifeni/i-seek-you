import { createSignal, onMount } from 'solid-js'

const Actions = () => {
  const [isDark, setDark] = createSignal(true)

  onMount(() => {
    const theme = localStorage.getItem('theme')
    if (theme) setDark(theme === 'dark')
    document.documentElement.className = theme || 'dark'
  })

  const handleTheme = () => {
    document.documentElement.className = isDark() ? 'light' : 'dark'
    localStorage.setItem('theme', isDark() ? 'light' : 'dark')
    setDark(theme => !theme)
  }

  return (
    <div display="flex" items="center" justify="end" flex="1" gap="8">
      <button
        class={isDark() ? 'i-ic-round-light-mode' : 'i-ic-round-dark-mode'}
        text="secondary hover:primary"
        w="6"
        h="6"
        cursor="pointer"
        transition="color"
        onClick={handleTheme}
      >
        Switch Theme
      </button>
      <button
        class="i-ic-round-settings"
        text="secondary hover:primary"
        w="6"
        h="6"
        cursor="pointer"
        transition="color"
      >
        Settings
      </button>
    </div>
  )
}

export { Actions }
