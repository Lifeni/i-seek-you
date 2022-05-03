import { useLocation, useNavigate } from 'solid-app-router'
import { batch, createEffect, createMemo, on, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { VoiceProvider } from '../context/channels/Voice'
import { useConnection } from '../context/Connection'
import { useServer } from '../context/Server'
import { Modal } from './base/Modal'
import { Login } from './channels/Login'
import { Message } from './channels/Message'
import { Voice } from './channels/Voice'

export const Channels = () => {
  const servers = useServer()
  const connections = useConnection()

  const [server] = servers
  const [connection, { setId, setSignal, setInfo, resetConnection }] =
    connections

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
        if (signal() !== 'idle') return
        setSignal('loading')
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
          batch(() => {
            setSignal('loading')
            setInfo('Calling...')
          })

          const handleMessage = (event: MessageEvent) => {
            const { type, pk } = event.data
            if (type !== 'keypair') return
            console.debug('[sm2]', 'new keypair')
            server.websocket?.send('call', { id, pk })
            worker?.removeEventListener('message', handleMessage)
          }

          const worker = server.worker
          worker?.addEventListener('message', handleMessage)
          worker?.postMessage({ action: 'keypair' })
          break
        }
        case 'answer': {
          batch(() => {
            setSignal('loading')
            setInfo('Key Generating...')
          })

          const handleMessage = (event: MessageEvent) => {
            const { type, pk, ra } = event.data
            if (type !== 'exchange-1') return
            console.debug('[sm2]', 'new keypair')
            console.debug('[sm2]', 'exchange 1')
            server.websocket?.send('answer', { id, pk, ra })
            worker?.removeEventListener('message', handleMessage)
          }

          const worker = server.worker
          worker?.addEventListener('message', handleMessage)
          worker?.postMessage({
            action: 'exchange-1',
            id: server.id,
            pid: connection.id,
          })
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
        <Title>
          {connection.peer.name || 'Channel'} #{connection.id} - I Seek You
        </Title>
      </Show>

      <Login />

      <Modal
        name={`${connection.peer.name || 'Channel'} #${connection.id}`}
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
          <VoiceProvider>
            <Voice />
          </VoiceProvider>
        </div>
      </Modal>
    </>
  )
}
