import { useNavigate } from 'solid-app-router'
import { RiOthersDoorLockFill } from 'solid-icons/ri'
import { createSignal, Show } from 'solid-js'
import { useSettings } from '../../../context/Settings'
import { Field, Input, Switch } from '../../base/Form'
import { Link, Subtle } from '../../base/Text'

export const Password = () => {
  const navigate = useNavigate()
  const [settings, { setPassword }] = useSettings()
  const [isEnabled, setEnabled] = createSignal(!!settings.password)

  const handleToggle = () => {
    setEnabled(stat => !stat)
    if (!isEnabled()) setPassword('')
  }

  return (
    <Field name="Password" icon={RiOthersDoorLockFill}>
      <label for="connection-password" flex="~" items="center">
        <span flex="1">Connection Password</span>
        <Switch
          name="Enable Password"
          isEnabled={isEnabled()}
          onChange={handleToggle}
        />
      </label>

      <Show when={isEnabled()}>
        <Input
          type="text"
          name="connection-password"
          placeholder={isEnabled() ? 'Your Password' : 'Not Enabled'}
          disabled={!isEnabled()}
          value={settings.password}
          onInput={e => setPassword((e.target as HTMLInputElement).value)}
          onEnter={() => navigate('/')}
        />
      </Show>

      <Subtle>
        You can set a password to prevent unknown connections.
        <Link
          isExternal
          href="https://github.com/Lifeni/i-seek-you/#password"
          m="l-2"
        >
          Learn More
        </Link>
      </Subtle>
    </Field>
  )
}
