import { useNavigate, type Navigator } from 'solid-app-router'
import { batch } from 'solid-js'
import { type WebSocketType } from '../../index.d'
import { useConnection, type Connection } from '../context/Connection'
import { useServer, type Server } from '../context/Server'
import { useSettings, type Settings } from '../context/Settings'
import { DataChannel } from './peer-connection/DataChannel'
import { Media } from './peer-connection/Media'

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

  public onMessage(event: MessageEvent) {
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
        const { peer, password } = data as WebSocketType['Call']
        if (
          !this.context.settings[0].password ||
          password === this.context.settings[0].password
        ) {
          if (this.context.connection[0].signal === 'idle') {
            this.context.connection[1].setConfirm(true)
            this.context.connection[1].setPeer(peer)
          } else
            this.send('error', {
              id: peer.id,
              message: 'Peer is Busy',
            })
        } else
          this.send('error', {
            id: peer.id,
            message: 'Authentication Failed',
          })
        break
      }
      case 'disconnect': {
        this.context.connection[1].resetConnection()
        this.navigate('/')
        break
      }
      case 'answer': {
        const webrtc = new DataChannel({
          settings: this.context.settings,
          server: this.context.server,
          connection: this.context.connection,
          caller: true,
          id: this.context.connection[0].id,
        })
        this.channel = webrtc
        this.context.connection[1].setChannel(webrtc)
        this.context.connection[1].setSignal('sdp')
        this.context.connection[1].setInfo('Connecting...')
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
