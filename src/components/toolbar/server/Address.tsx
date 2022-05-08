import { useI18n } from '@solid-primitives/i18n'
import { useNavigate } from 'solid-app-router'
import { createSignal, Show } from 'solid-js'
import { defaultSettings, useSettings } from '../../../context/Settings'
import { TextButton } from '../../base/Button'
import { Fold, Input } from '../../base/Form'
import { Tooltip } from '../../base/Popover'

export const Signaling = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const [settings, { setSignaling }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name={t('server_signaling')} description={settings.signaling}>
      <Tooltip name={t('server_url')}>
        <Input
          type="text"
          name="signaling-server"
          placeholder={defaultSettings[0].signaling}
          value={settings.signaling}
          onInput={e => {
            setSignaling((e.target as HTMLInputElement).value)
            setChanged(true)
          }}
          onEnter={() => navigate('/')}
        />
      </Tooltip>
      <Show when={isChanged()}>
        <NeedReload />
      </Show>
    </Fold>
  )
}

export const STUN = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const [settings, { setSTUN }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name="STUN" description={settings.stun}>
      <Tooltip name={t('server_url')}>
        <Input
          type="text"
          name="stun-server"
          placeholder={defaultSettings[0].stun}
          value={settings.stun}
          onInput={e => {
            setSTUN((e.target as HTMLInputElement).value)
            setChanged(true)
          }}
          onEnter={() => navigate('/')}
        />
      </Tooltip>
      <Show when={isChanged()}>
        <NeedReload />
      </Show>
    </Fold>
  )
}

export const TURN = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const [settings, { setTURN }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name="TURN" description={settings.turn.urls}>
      <Tooltip name={t('server_url')}>
        <Input
          type="text"
          name="turn-urls"
          placeholder={defaultSettings[0].turn.urls}
          value={settings.turn.urls}
          onInput={e => {
            setTURN({
              ...settings.turn,
              urls: (e.target as HTMLInputElement).value,
            })
            setChanged(true)
          }}
          onEnter={() => navigate('/')}
        />
      </Tooltip>
      <div grid="~ cols-2" gap="2">
        <Tooltip name={t('server_username')}>
          <Input
            type="text"
            name="turn-username"
            placeholder={defaultSettings[0].turn.username}
            value={settings.turn.username}
            onInput={e => {
              setTURN({
                ...settings.turn,
                username: (e.target as HTMLInputElement).value,
              })
              setChanged(true)
            }}
            onEnter={() => navigate('/')}
          />
        </Tooltip>

        <Tooltip name={t('server_password')}>
          <Input
            type="text"
            name="turn-password"
            placeholder={defaultSettings[0].turn.password}
            value={settings.turn.password}
            onInput={e => {
              setTURN({
                ...settings.turn,
                password: (e.target as HTMLInputElement).value,
              })
              setChanged(true)
            }}
            onEnter={() => navigate('/')}
          />
        </Tooltip>
      </div>
      <Show when={isChanged()}>
        <NeedReload />
      </Show>
    </Fold>
  )
}

const NeedReload = () => (
  <p flex="~" items="center" text="sm red-500 dark:red-400">
    <span flex="~ 1">* Need To Reload Page</span>
    <TextButton onClick={() => window.location.reload()}>Reload</TextButton>
  </p>
)
