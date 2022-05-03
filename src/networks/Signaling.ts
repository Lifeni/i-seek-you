import { useNavigate, type Navigator } from 'solid-app-router'
import { batch } from 'solid-js'
import { type WebSocketType } from '../../index.d'
import { useConnection, type Connection } from '../context/Connection'
import { useServer, type Server } from '../context/Server'
import { useSettings, type Settings } from '../context/Settings'
import { DataChannel } from './connection/DataChannel'
import { Media } from './connection/Media'

export class Signaling {
  public websocket: WebSocket
  public channel: InstanceType<typeof DataChannel> | undefined | null
  public media: InstanceType<typeof Media> | undefined | null
  public navigate: Navigator

  public context: {
    settings: Readonly<Settings>
    server: Readonly<Server>
    connection: Readonly<Connection>
  }

  public start: number

  constructor() {
    this.navigate = useNavigate()
    this.context = {
      settings: useSettings(),
      server: useServer(),
      connection: useConnection(),
    }

    const protocol = this.context.settings[0].signaling.includes('localhost')
      ? 'ws'
      : 'wss'

    this.websocket = new WebSocket(
      `${protocol}://${this.context.settings[0].signaling}`
    )
    console.debug(
      '[websocket]',
      'connect to',
      this.context.settings[0].signaling
    )
    this.start = new Date().getTime()

    this.websocket.addEventListener('open', () => this.onOpen())
    this.websocket.addEventListener('closed', () => this.onClose())
    this.websocket.addEventListener('error', () => this.onError())
    this.websocket.addEventListener('message', e => this.onMessage(e))
  }

  public send<T>(type: string, message?: T) {
    if (type !== 'ping') console.debug('[websocket]', 'send ->', type)
    this.websocket.send(JSON.stringify({ type, ...message }))
  }

  public onOpen() {
    console.debug('[websocket]', 'connected')
    this.send('sign', {
      name: this.context.settings[0].name,
      password: !!this.context.settings[0].password,
      emoji: this.context.settings[0].emoji,
    })
    this.send('ping')
    setInterval(() => {
      this.start = new Date().getTime()
      this.send('ping')
    }, 5000)
  }

  public async onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data)
    if (data.type !== 'pong')
      console.debug('[websocket]', 'received ->', data.type)

    switch (data.type) {
      case 'pong': {
        const end = new Date().getTime()
        this.context.server[1].setPing(end - this.start)
        break
      }
      case 'id': {
        const { id } = data as WebSocketType['Id']
        this.context.server[1].setId(id)
        this.context.server[1].setStatus('connected')
        break
      }
      case 'peer': {
        const { peer } = data as WebSocketType['Peer']
        if (peer.password) this.context.connection[1].setSignal('auth')
        else this.context.connection[1].setSignal('call')
        this.context.connection[1].setPeer(peer)
        this.context.connection[1].setInfo('Calling...')
        break
      }
      case 'lobby': {
        const { peers } = data as WebSocketType['Lobby']
        const lobby = peers.filter(
          peer => peer.id !== this.context.server[0].id
        )
        this.context.server[1].setPeers(lobby)
        break
      }
      case 'call': {
        const { peer, password, pk } = data as WebSocketType['Call']

        const pass = this.context.settings[0].password ?? ''
        const key = `${peer.id}->${this.context.server[0].id}:${pass}`

        const handleMessage = (event: MessageEvent) => {
          const { type, hash } = event.data
          if (type !== 'answer') return

          if (this.context.settings[0].password && password !== hash)
            this.send('error', {
              id: peer.id,
              message: 'Authentication Failed',
            })
          else {
            if (this.context.connection[0].signal === 'idle')
              batch(() => {
                this.context.connection[1].setConfirm(true)
                this.context.connection[1].setPeer(peer)
              })
            else
              this.send('error', {
                id: peer.id,
                message: 'Peer is Busy',
              })
          }

          worker?.removeEventListener('message', handleMessage)
        }

        const worker = this.context.server[0].worker
        worker?.addEventListener('message', handleMessage)
        worker?.postMessage({ action: 'answer', text: key, ppk: pk })
        break
      }
      case 'disconnect': {
        this.context.connection[1].resetConnection()
        this.navigate('/')
        break
      }
      case 'answer': {
        const { pk, ra } = data as WebSocketType['Answer']
        const peer = this.context.connection[0].peer

        const handleMessage = (event: MessageEvent) => {
          const { type, rb, sb } = event.data
          if (type !== 'exchange-2') return

          console.debug('[sm2]', 'exchange 2')
          batch(() => {
            this.context.connection[1].setSignal('loading')
            this.context.connection[1].setInfo('Key Generating...')
          })

          this.send('exchange-a', { id: peer.id, rb, sb })
          worker?.removeEventListener('message', handleMessage)
        }

        const worker = this.context.server[0].worker
        worker?.addEventListener('message', handleMessage)
        worker?.postMessage({
          action: 'exchange-2',
          id: this.context.server[0].id,
          pid: this.context.connection[0].id,
          ppk: pk,
          ra,
        })
        break
      }
      case 'exchange-a': {
        const { rb, sb } = data as WebSocketType['ExchangeA']
        const peer = this.context.connection[0].peer

        const handleMessage = (event: MessageEvent) => {
          const { type, sa } = event.data
          if (type !== 'exchange-3') return

          console.debug('[sm2]', 'exchange 3')
          this.send('exchange-b', { id: peer.id, sa })
          worker?.removeEventListener('message', handleMessage)
        }

        const worker = this.context.server[0].worker
        worker?.addEventListener('message', handleMessage)
        worker?.postMessage({ action: 'exchange-3', rb, sb })
        break
      }

      case 'exchange-b': {
        const { sa } = data as WebSocketType['ExchangeB']
        const peer = this.context.connection[0].peer

        const handleMessage = (event: MessageEvent) => {
          const { type, result } = event.data
          if (type !== 'exchange-4') return

          console.debug('[sm2]', 'exchange 4')
          if (result) {
            this.send('connect', { id: peer.id })
            const webrtc = new DataChannel({
              settings: this.context.settings,
              server: this.context.server,
              connection: this.context.connection,
              caller: true,
              id: this.context.connection[0].id,
            })
            this.channel = webrtc
            batch(() => {
              this.context.connection[1].setChannel(webrtc)
              this.context.connection[1].setInfo('Connecting...')
            })
          } else
            this.send('error', { id: peer.id, message: 'Key Exchange Failed' })
          worker?.removeEventListener('message', handleMessage)
        }

        const worker = this.context.server[0].worker
        worker?.addEventListener('message', handleMessage)
        worker?.postMessage({ action: 'exchange-4', sa })
        break
      }
      case 'connect': {
        const webrtc = new DataChannel({
          settings: this.context.settings,
          server: this.context.server,
          connection: this.context.connection,
          id: this.context.connection[0].id,
        })
        this.channel = webrtc
        batch(() => {
          this.context.connection[1].setChannel(webrtc)
          this.context.connection[1].setInfo('Connecting...')
        })
        break
      }
      case 'media': {
        const webrtc = new Media({
          settings: this.context.settings,
          server: this.context.server,
          connection: this.context.connection,
          id: this.context.connection[0].id,
        })
        this.media = webrtc
        this.context.connection[1].setMedia(webrtc)
        break
      }
      case 'sdp-offer': {
        const { sdp, name } = data as WebSocketType['Sdp']
        this.checkWebRTC()
        if (name === 'data-channel') this.channel?.receiveOffer(sdp)
        else this.media?.receiveOffer(sdp)
        break
      }
      case 'sdp-answer': {
        const { sdp, name } = data as WebSocketType['Sdp']
        this.checkWebRTC()
        if (name === 'data-channel') this.channel?.receiveAnswer(sdp)
        else this.media?.receiveAnswer(sdp)
        break
      }
      case 'ice-candidate': {
        const { candidate, name } = data as WebSocketType['Ice']
        this.checkWebRTC()
        if (name === 'data-channel') this.channel?.addIceCandidate(candidate)
        else this.media?.addIceCandidate(candidate)
        break
      }
      case 'error': {
        const { message } = data as WebSocketType['Error']
        batch(() => {
          this.context.connection[1].setError(message)
          this.context.connection[1].setMode('other')
          this.context.connection[1].setSignal('error')
        })
        break
      }
    }
  }

  public onClose() {
    console.debug('[websocket]', 'closed')
    this.context.server[1].resetServer('closed')
    this.close()
  }

  public onError() {
    console.debug('[websocket]', 'error')
    this.context.server[1].resetServer('error')
    this.close()
  }

  public close() {
    this.context.connection[1].resetConnection()
    this.channel = null
    this.media = null
    this.navigate('/')
  }

  public checkWebRTC() {
    this.channel = this.context.connection[0].channel
    this.media = this.context.connection[0].media
  }
}
