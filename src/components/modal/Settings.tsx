import { createSignal, For, onMount, type JSX } from 'solid-js'
import Logo from '../../assets/logo.svg'
import { Field, Form, Radio } from '../base/Form'
import { ExternalLink } from '../base/Link'
import { Tooltip } from '../base/Tooltip'
import { Modal } from './Modal'

interface SettingsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  close: () => void
}

export const Settings = (props: SettingsProps) => (
  <Modal title="Settings" close={props.close}>
    <Form>
      <Theme />
      <About />
    </Form>
    <hr border="0 t-1 main" m="y-5" />
    <span text="sm light">
      Tip: To set a connection password or other connection-related settings,
      click on the Emoji avatar on the home page.
    </span>
  </Modal>
)

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
    <Field legend="Theme">
      <For each={['dark', 'light']}>
        {item => (
          <Radio
            type="radio"
            name="theme"
            checked={theme() === item}
            value={item}
            label={item}
            onInput={handleTheme}
          />
        )}
      </For>
    </Field>
  )
}

export const About = () => (
  <Field legend="About">
    <article w="full" flex="between" gap="6">
      <img src={Logo} alt="Logo" w="12" h="12" m="b-2" />
      <div flex="col start" gap="2">
        <span w="full" font="bold" flex="start" gap="3">
          I Seek You
          <Tooltip label="GitHub">
            <ExternalLink
              aria-label="GitHub"
              href="https://github.com/Lifeni/i-seek-you"
              text="light hover:main"
              class="transition"
            >
              <span class="i-bxl-github" w="5" h="5" flex="center" />
            </ExternalLink>
          </Tooltip>
        </span>
        <span text="sm">
          A WebRTC-based cross-platform data transfer application.
        </span>
      </div>
    </article>
  </Field>
)

export default Settings
