import { useLocation, useNavigate } from 'solid-app-router'
import { RiSystemCloseFill } from 'solid-icons/ri'
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

      <Modal size="lg" isOpen={open()}>
        <div w="full" m="b-3" p="x-3 t-2" flex="~" items="center">
          <h1 text="lg" font="bold" m="0" p="x-3" flex="1">
            Channels #{id()}
          </h1>

          <button
            role="tooltip"
            aria-label="Disconnect"
            data-position="top"
            flex="~"
            rounded="full"
            p="3"
            border="none"
            text="inherit hover:(light-100 dark:light-600)"
            bg="transparent hover:rose-500"
            onClick={handleClose}
          >
            <RiSystemCloseFill class="w-6 h-6" />
          </button>
        </div>
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
