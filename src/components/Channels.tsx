import { SM2, SM2ExchangeA } from '@lifeni/libsm-js'
import { useLocation, useNavigate } from 'solid-app-router'
import { batch, createEffect, createMemo, on, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { VoiceProvider } from '../context/channels/Voice'
import { useConnection } from '../context/Connection'
import { useServer } from '../context/Server'
import { toHex } from '../libs/Utils'
import { Modal } from './base/Modal'
import { Login } from './channels/Login'
import { Message } from './channels/Message'
import { Voice } from './channels/Voice'

export const Channels = () => {
  const servers = useServer()
  const connections = useConnection()

  const [server] = servers
  const [
    connection,
    { setId, setSignal, setInfo, setKeys, setExchange, resetConnection },
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
          batch(() => {
            setSignal('loading')
            setInfo('Calling...')
          })

          const sm2 = new SM2()
          const pair = sm2.new_keypair()
          console.debug('[sm2]', 'new keypair')

          batch(() => {
            setKeys('pk', pair.pk)
            setKeys('sk', pair.sk)
          })

          server.websocket?.send('call', { id, pk: toHex(pair.pk) })
          break
        }
        case 'answer': {
          if (!connection.keys) return
          batch(() => {
            setSignal('loading')
            setInfo('Key Generating...')
          })

          const sm2 = new SM2()
          const pair = sm2.new_keypair()
          console.debug('[sm2]', 'new keypair')

          const exchange = new SM2ExchangeA(
            16,
            server.id,
            connection.id,
            pair.pk,
            connection.keys.ppk,
            pair.sk
          )
          const ra = exchange.exchange1()
          console.debug('[sm2]', 'exchange 1')

          batch(() => {
            setKeys('pk', pair.pk)
            setKeys('sk', pair.sk)
            setKeys('ra', pair.ra)
            setExchange(exchange)
          })

          server.websocket?.send('answer', {
            id,
            pk: toHex(pair.pk),
            ra: toHex(ra),
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
