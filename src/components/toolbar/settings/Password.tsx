import { useI18n } from '@solid-primitives/i18n'
import { useNavigate } from 'solid-app-router'
import { RiOthersDoorLockFill } from 'solid-icons/ri'
import { createSignal, Show } from 'solid-js'
import { useSettings } from '../../../context/Settings'
import { Field, Input, Switch } from '../../base/Form'
import { Link, Subtle } from '../../base/Text'

export const Password = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const [settings, { setPassword, setE2EE }] = useSettings()
  const [hasPassword, setHasPassword] = createSignal(!!settings.password)

  const handleTogglePassword = () => {
    setHasPassword(stat => !stat)
    if (!hasPassword()) setPassword('')
  }

  return (
    <Field name={t('settings_security')} icon={RiOthersDoorLockFill}>
      <label for="connection-password" flex="~" items="center">
        <span flex="1">{t('settings_password_label')}</span>
        <Switch
          name={t('settings_password_enable')}
          isEnabled={hasPassword()}
          onChange={handleTogglePassword}
        />
      </label>

      <Show when={hasPassword()}>
        <Input
          type="text"
          name="connection-password"
          placeholder={t('settings_password_name')}
          disabled={!hasPassword()}
          value={settings.password}
          onInput={e => setPassword((e.target as HTMLInputElement).value)}
          onEnter={() => navigate('/')}
        />
      </Show>

      <Subtle>
        {t('settings_password_description')}
        <Link
          isExternal
          href="https://github.com/Lifeni/i-seek-you/#password"
          m="l-1"
        >
          {t('learn_more')}
        </Link>
      </Subtle>

      <label flex="~" items="center">
        <span flex="1">{t('settings_e2ee_label')}</span>
        <Switch
          name={t('settings_e2ee_enable')}
          isEnabled={settings.e2ee}
          onChange={() => setE2EE(!settings.e2ee)}
        />
      </label>

      <Subtle>{t('settings_e2ee_description')}</Subtle>
    </Field>
  )
}
