import { useNavigate, type Navigator } from 'solid-app-router'
import { batch } from 'solid-js'
import { type WsType } from '../../index.d'
import { useBuffer, type Buffer } from '../context/Buffer'
import { useChannel, type Channel } from '../context/Channel'
import { useConnection, type Connection } from '../context/Connection'
import { useSettings, type Settings } from '../context/Settings'
import { PeerConnection } from './PeerConnection'

export class Signaling {
  public websocket: WebSocket
  public webrtc: InstanceType<typeof PeerConnection> | undefined | null
  public navigate: Navigator
  public context: {
    settings: Readonly<Settings>
    connection: Readonly<Connection>
    buffer: Readonly<Buffer>
    channel: Readonly<Channel>
  }

  public start: number

  constructor() {
    this.navigate = useNavigate()
    this.context = {
      settings: useSettings(),
      connection: useConnection(),
      buffer: useBuffer(),
      channel: useChannel(),
    }

    this.websocket = new WebSocket(this.context.settings[0].server)
    console.debug('[websocket]', 'connect to', this.context.settings[0].server)
    this.start = new Date().getTime()

    this.websocket.addEventListener('open', () => this.onOpen())
    this.websocket.addEventListener('closed', () => this.onClose())
    this.websocket.addEventListener('error', () => this.onError())
    this.websocket.addEventListener('message', e => this.onMessage(e))
  }

  public send<T>(type: string, message?: T) {
    if (type !== 'ping') console.debug('[websocket]', 'send -', type)
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
      console.debug('[websocket]', 'received -', data.type)

    switch (data.type) {
      case 'pong': {
        const end = new Date().getTime()
        this.context.connection[1].setPing(end - this.start)
        break
      }
      case 'id': {
        const { id } = data as WsType['Id']
        this.context.connection[1].setId(id)
        this.context.connection[1].setStatus('connected')
        break
      }
      case 'peer': {
        const { peer } = data as WsType['Peer']
        if (peer.password) this.context.channel[1].setSignal('auth')
        else this.context.channel[1].setSignal('call')
        this.context.channel[1].setPeer(peer)
        this.context.channel[1].setInfo('Calling...')
        break
      }
      case 'lobby': {
        const { peers } = data as WsType['Lobby']
        const lobby = peers.filter(
          peer => peer.id !== this.context.connection[0].id
        )
        this.context.connection[1].setPeers(lobby)
        break
      }
      case 'call': {
        const { peer, password } = data as WsType['Call']
        if (
          !this.context.settings[0].password ||
          password === this.context.settings[0].password
        ) {
          if (this.context.channel[0].signal === 'idle') {
            this.context.channel[1].setConfirm(true)
            this.context.channel[1].setPeer(peer)
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
        this.context.channel[1].resetChannel()
        this.context.buffer[1].resetBuffer()
        this.navigate('/')
        break
      }
      case 'answer': {
        const webrtc = new PeerConnection({
          channel: this.context.channel,
          buffer: this.context.buffer,
          connection: this.context.connection,
          caller: true,
          id: this.context.channel[0].id,
        })
        this.webrtc = webrtc
        this.context.channel[1].setConnection(webrtc)
        this.context.channel[1].setSignal('sdp')
        this.context.channel[1].setInfo('Connecting...')
        break
      }
      case 'sdp-offer': {
        const { sdp } = data as WsType['Sdp']
        this.checkWebRTC()
        this.webrtc?.receiveOffer(sdp)
        break
      }
      case 'sdp-answer': {
        const { sdp } = data as WsType['Sdp']
        this.checkWebRTC()
        this.webrtc?.receiveAnswer(sdp)
        break
      }
      case 'ice-candidate': {
        const { candidate } = data as WsType['Ice']
        this.checkWebRTC()
        this.webrtc?.addIceCandidate(candidate)
        break
      }
      case 'error': {
        const { message } = data as WsType['Error']
        batch(() => {
          this.context.channel[1].setError(message)
          this.context.channel[1].setMode('other')
          this.context.channel[1].setSignal('error')
        })
        break
      }
    }
  }

  public onClose() {
    console.debug('[websocket]', 'closed')
    this.context.connection[1].resetConnection('closed')
    this.close()
  }

  public onError() {
    console.debug('[websocket]', 'error')
    this.context.connection[1].resetConnection('error')
    this.close()
  }

  public close() {
    this.context.channel[1].resetChannel()
    this.context.buffer[1].resetBuffer()
    this.webrtc = null
    this.navigate('/')
  }

  public checkWebRTC() {
    this.webrtc = this.context.channel[0].connection
  }
}
