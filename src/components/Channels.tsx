import { useLocation, useNavigate } from 'solid-app-router'
import { batch, createEffect, createMemo, on, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { useChannel } from '../context/Channel'
import { useConnection } from '../context/Connection'
import { Modal } from './base/Modal'
import { Login } from './channels/Login'
import { Message } from './channels/Message'
import { Voice } from './channels/Voice'

export const Channels = () => {
  const [connection, { sendWebSocket }] = useConnection()
  const [channel, { setId, setSignal, setMode, resetChannel }] = useChannel()
  const navigate = useNavigate()
  const location = useLocation()

  const path = createMemo(() => {
    const match = location.pathname.match(/^\/channels\/(.+)/)
    return match ? match[1] : ''
  })
  const open = () => !!path()
  const status = createMemo(() => connection.status)
  const signal = createMemo(() => channel.signal)

  const isOther = () => channel.mode === 'other'
  const isVoice = () => channel.mode === 'voice'

  createEffect(
    on([path, status], ([id, status]) => {
      if (id && status === 'connected') {
        batch(() => {
          setId(id)
          if (signal() === 'idle') sendWebSocket('find', { id })
          setSignal('loading')
        })
      }
    })
  )

  createEffect(
    on([path, signal], ([id, signal]) => {
      if (id) {
        if (signal === 'call') sendWebSocket('call', { id: path() })
        else if (signal === 'answer') {
          sendWebSocket('answer', { id: path() })
          batch(() => {
            setSignal('connecting')
            setMode('message')
          })
        }
      }
    })
  )

  const handleClose = () => {
    navigate('/')
    resetChannel()
  }

  return (
    <>
      <Show when={open()}>
        <Title>Channels #{channel.id} - I Seek You</Title>
      </Show>

      <Login />

      <Modal
        title={`Channels #${channel.id}`}
        size="lg"
        isUncloseable={true}
        isOpen={!isOther() && open()}
        onClose={handleClose}
      >
        <Show when={isVoice()} fallback={<Message />}>
          <Voice />
        </Show>
      </Modal>
    </>
  )
}
