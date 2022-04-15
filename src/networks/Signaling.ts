import { useNavigate, type Navigator } from 'solid-app-router'
import { batch } from 'solid-js'
import { type WsType } from '../../index.d'
import { useChannel, type Channel } from '../context/Channel'
import { useConnection, type Connection } from '../context/Connection'
import { useSettings, type Settings } from '../context/Settings'
import { PeerConnection } from './PeerConnection'

export class Signaling {
  public websocket: WebSocket

  public navigate: Navigator
  public settings: Readonly<Settings>
  public connection: Readonly<Connection>
  public channel: Readonly<Channel>

  public webrtc: InstanceType<typeof PeerConnection> | null

  public start: number

  constructor() {
    this.navigate = useNavigate()
    this.settings = useSettings()
    this.connection = useConnection()
    this.channel = useChannel()
    this.webrtc = this.channel[0].connection

    this.websocket = new WebSocket(this.settings[0].server)
    console.debug('[websocket]', 'connecting to', this.settings[0].server)
    this.start = new Date().getTime()

    this.websocket.addEventListener('open', () => this.onOpen())
    this.websocket.addEventListener('closed', () => this.onClose())
    this.websocket.addEventListener('error', () => this.onError())
    this.websocket.addEventListener('message', e => this.onMessage(e))
  }

  public send<T>(type: string, message?: T) {
    if (type !== 'ping') console.debug('[websocket]', 'sending', type, message)
    this.websocket.send(JSON.stringify({ type, ...message }))
  }

  public onOpen() {
    console.debug('[websocket]', 'connected')
    this.send('sign', {
      name: this.settings[0].name,
      password: !!this.settings[0].password,
      emoji: this.settings[0].emoji,
    })
    this.send('ping')
    setInterval(() => {
      this.start = new Date().getTime()
      this.send('ping')
    }, 5000)
  }

  public onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data)
    if (data.type !== 'pong') console.debug('[websocket]', 'received', data)

    switch (data.type) {
      case 'pong': {
        const end = new Date().getTime()
        this.connection[1].setPing(end - this.start)
        break
      }
      case 'id': {
        const { id } = data as WsType['Id']
        this.connection[1].setId(id)
        this.connection[1].setStatus('connected')
        break
      }
      case 'peer': {
        const { peer } = data as WsType['Peer']
        if (peer.password) this.channel[1].setSignal('auth')
        else this.channel[1].setSignal('call')
        this.channel[1].setPeer(peer)
        break
      }
      case 'lobby': {
        const { peers } = data as WsType['Lobby']
        const lobby = peers.filter(peer => peer.id !== this.connection[0].id)
        this.connection[1].setPeers(lobby)
        break
      }
      case 'call': {
        const { peer, password } = data as WsType['Call']
        if (
          !this.settings[0].password ||
          password === this.settings[0].password
        ) {
          if (this.channel[0].signal === 'idle') {
            this.channel[1].setConfirm(true)
            this.channel[1].setPeer(peer)
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
        this.channel[1].resetChannel()
        this.navigate('/')
        break
      }
      case 'answer': {
        batch(() => {
          const webrtc = new PeerConnection()
          this.channel[1].setConnection(webrtc)
          this.channel[1].setSignal('sdp')
          this.channel[1].setInfo('Connecting...')
          webrtc?.sendOffer(this.channel[0].id)
        })
        break
      }
      case 'sdp-offer': {
        const { sdp } = data as WsType['Sdp']
        this.webrtc?.receiveOffer(sdp)
        break
      }
      case 'sdp-answer': {
        const { sdp } = data as WsType['Sdp']
        this.webrtc?.receiveAnswer(sdp)
        break
      }
      case 'ice-candidate': {
        const { candidate } = data as WsType['Ice']
        this.webrtc?.addIceCandidate(candidate)
        break
      }
      case 'error': {
        const { message } = data as WsType['Error']
        batch(() => {
          this.channel[1].setError(message)
          this.channel[1].setMode('other')
          this.channel[1].setSignal('error')
        })
        break
      }
    }
  }

  public onClose() {
    console.debug('[websocket]', 'closed')
    this.connection[1].resetConnection('closed')
    this.channel[1].resetChannel()
    this.navigate('/')
  }

  public onError() {
    console.debug('[websocket]', 'error')
    this.connection[1].resetConnection('error')
    this.channel[1].resetChannel()
    this.navigate('/')
  }
}
