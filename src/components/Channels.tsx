import { useLocation, useNavigate } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { useChannel } from '../context/Channel'
import { Modal } from './base/Modal'
import { Controls } from './channels/Controls'
import { Input } from './channels/Input'
import { Mode } from './channels/Mode'

export const Channels = () => {
  const [channel] = useChannel()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)
  const [id, setId] = createSignal('')

  createEffect(() => {
    const isChannels = location.pathname.startsWith('/channels/')
    setOpen(isChannels)
    if (isChannels) setId(location.pathname.replace('/channels/', ''))
  })
  const handleClose = () => navigate('/')

  return (
    <>
      <Show when={open()}>
        <Title>Channels #{id()} - I Seek You</Title>
      </Show>

      <Modal
        title={`Channels #${id()}`}
        size="lg"
        isFocus
        isOpen={open()}
        onClose={handleClose}
      >
        <div
          w="full"
          min-h="50vh"
          flex="~"
          items="center"
          justify="center"
          p="x-3"
        >
          <span text="lg gray-500 dark:gray-400">
            <Show when={channel.mode === 'text'} fallback="Voice Mode">
              Text Mode
            </Show>
          </span>
        </div>
        <div w="full" flex="~" items="end" p="x-6 b-6" gap="4">
          <Mode />
          <Switch>
            <Match when={channel.mode === 'text'}>
              <Input />
            </Match>
            <Match when={channel.mode === 'voice'}>
              <Controls />
            </Match>
          </Switch>
        </div>
      </Modal>
    </>
  )
}
