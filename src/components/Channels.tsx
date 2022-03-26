import { useLocation, useNavigate } from 'solid-app-router'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Modal } from './base/Modal'

export const Channels = () => {
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
        size="md"
        isOpen={open()}
        onClose={handleClose}
      >
        <div p="x-3"></div>
      </Modal>
    </>
  )
}
