import { useNavigate } from 'solid-app-router'
import { createSignal, Show } from 'solid-js'
import { defaultSettings, useSettings } from '../../../context/Settings'
import { Fold, Input } from '../../base/Form'
import { Tooltip } from '../../base/Popover'

export const Signaling = () => {
  const navigate = useNavigate()
  const [settings, { setSignaling }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name="Signaling" description={settings.signaling}>
      <Tooltip name="Server URL">
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
  const navigate = useNavigate()
  const [settings, { setSTUN }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name="STUN" description={settings.stun}>
      <Tooltip name="Server URL">
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
  const navigate = useNavigate()
  const [settings, { setTURN }] = useSettings()
  const [isChanged, setChanged] = createSignal(false)

  return (
    <Fold name="TURN" description={settings.turn.urls}>
      <Tooltip name="Server URL">
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
        <Tooltip name="Username">
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

        <Tooltip name="Password">
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
    <button
      text="inherit hover:underline"
      p="0"
      border="none"
      bg="transparent"
      font="bold"
      onClick={() => window.location.reload()}
    >
      Reload
    </button>
  </p>
)
