import { useLocation, useNavigate } from 'solid-app-router'
import { batch, createEffect, createMemo, on, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { useBuffer } from '../context/Buffer'
import { useChannel } from '../context/Channel'
import { useConnection } from '../context/Connection'
import { PeerConnection } from '../networks/PeerConnection'
import { Modal } from './base/Modal'
import { Login } from './channels/Login'
import { Message } from './channels/Message'
import { Voice } from './channels/Voice'

export const Channels = () => {
  const connections = useConnection()
  const buffers = useBuffer()
  const channels = useChannel()
  const [connection] = connections
  const [channel, { setId, setSignal, setInfo, setConnection, resetChannel }] =
    channels
  const navigate = useNavigate()
  const location = useLocation()
  const [, { resetBuffer }] = buffers

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
          setSignal('loading')
          if (signal() === 'idle') {
            connection.signaling?.send('find', { id })
            setInfo('Finding...')
          }
        })
      }
    })
  )

  createEffect(
    on([path, signal], ([id, signal]) => {
      if (id) {
        switch (signal) {
          case 'call': {
            connection.signaling?.send('call', { id })
            setSignal('loading')
            setInfo('Calling...')
            break
          }
          case 'answer': {
            connection.signaling?.send('answer', { id })
            const webrtc = new PeerConnection({
              channel: channels,
              buffer: buffers,
              connection: connections,
              id,
            })
            setConnection(webrtc)
            setSignal('loading')
            break
          }
        }
      }
    })
  )

  const handleClose = () => {
    const id = path()
    if (id) connection.signaling?.send('disconnect', { id })
    navigate('/')
    resetChannel()
    resetBuffer()
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
