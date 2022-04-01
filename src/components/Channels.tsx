import { useLocation, useNavigate } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { useChannel } from '../context/Channel'
import { Modal } from './base/Modal'
import { Controls } from './channels/voice/Controls'
import { Input } from './channels/message/Input'
import { Voice } from './channels/Voice'
import { Message } from './channels/Message'
import { Loading } from './channels/Loading'

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
        isUncloseable={true}
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
            <Switch fallback={<Loading />}>
              <Match when={channel.mode === 'message'}>
                <Message />
              </Match>
              <Match when={channel.mode === 'voice'}>
                <Voice />
              </Match>
            </Switch>
          </span>
        </div>
        <Show when={channel.mode !== 'loading'}>
          <div w="full" flex="~" items="end" gap="4">
            <Switch>
              <Match when={channel.mode === 'message'}>
                <Input />
              </Match>
              <Match when={channel.mode === 'voice'}>
                <Controls />
              </Match>
            </Switch>
          </div>
        </Show>
      </Modal>
    </>
  )
}
