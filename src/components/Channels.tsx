import { useLocation, useNavigate } from 'solid-app-router'
import { batch, createEffect, createMemo, on, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { useConnection } from '../context/Connection'
import { useServer } from '../context/Server'
import { useSettings } from '../context/Settings'
import { PeerConnection } from '../networks/PeerConnection'
import { Modal } from './base/Modal'
import { Login } from './channels/Login'
import { Message } from './channels/Message'
import { Voice } from './channels/Voice'

export const Channels = () => {
  const settings = useSettings()
  const servers = useServer()
  const connections = useConnection()

  const [server] = servers
  const [
    connection,
    { setId, setSignal, setInfo, setWebRTC, resetConnection },
  ] = connections

  const navigate = useNavigate()
  const location = useLocation()

  const isMatch = createMemo(() => {
    const match = location.pathname.match(/^\/channels\/(.+)/)
    return match ? match[1] : ''
  })
  const isOpen = () => !!isMatch()

  const status = createMemo(() => server.status)
  const signal = createMemo(() => connection.signal)

  const isOther = () => connection.mode === 'other'
  const isVoice = () => connection.mode === 'voice'

  createEffect(
    on([isMatch, status], ([id, status]) => {
      if (!id || status !== 'connected') return
      batch(() => {
        setId(id)
        setSignal('loading')
        if (signal() !== 'idle') return
        server.websocket?.send('find', { id })
        setInfo('Finding...')
      })
    })
  )

  createEffect(
    on([isMatch, signal], ([id, signal]) => {
      if (!id) return
      switch (signal) {
        case 'call': {
          server.websocket?.send('call', { id })
          setSignal('loading')
          setInfo('Calling...')
          break
        }
        case 'answer': {
          server.websocket?.send('answer', { id })
          const webrtc = new PeerConnection({
            settings,
            server: servers,
            connection: connections,
            id,
          })
          setWebRTC(webrtc)
          setSignal('loading')
          break
        }
      }
    })
  )

  const handleClose = () => {
    const id = isMatch()
    if (!id) return
    server.websocket?.send('disconnect', { id })
    navigate('/')
    resetConnection()
  }

  return (
    <>
      <Show when={isOpen()}>
        <Title>Channel #{connection.id} - I Seek You</Title>
      </Show>

      <Login />

      <Modal
        name={`Channel #${connection.id}`}
        size="lg"
        hasTitleBar
        isDanger
        isOpen={!isOther() && isOpen()}
        onCancel={handleClose}
      >
        <div w="full" display={isVoice() ? 'hidden' : 'flex'}>
          <Message />
        </div>
        <div w="full" display={isVoice() ? 'flex' : 'hidden'}>
          <Voice />
        </div>
      </Modal>
    </>
  )
}
