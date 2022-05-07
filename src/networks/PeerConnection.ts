import { type ConnectionName } from '../../index.d'
import { type Connection } from '../context/Connection'
import { type Server } from '../context/Server'
import { type Settings } from '../context/Settings'
import { type Signaling } from './Signaling'

export interface PeerConnectionProps {
  name: ConnectionName
  settings: Readonly<Settings>
  server: Readonly<Server>
  connection: Readonly<Connection>
  id: string
  caller?: Readonly<boolean>
}

export class PeerConnection {
  public webrtc?: RTCPeerConnection | null
  public websocket: InstanceType<typeof Signaling> | null
  public channel: {
    message: RTCDataChannel | null | undefined
    file: RTCDataChannel | null | undefined
  }

  public id: Readonly<string>
  public caller: Readonly<boolean>
  public name: ConnectionName

  public context: {
    settings: Readonly<Settings>
    server: Readonly<Server>
    connection: Readonly<Connection>
  }

  constructor({
    name,
    settings,
    server,
    connection,
    id,
    caller,
  }: PeerConnectionProps) {
    this.context = { settings, server, connection }
    this.websocket = server[0].websocket
    this.channel = { message: null, file: null }
    this.id = id
    this.caller = !!caller
    this.name = name

    this.openConnection()
  }

  public close() {
    console.debug(`[${this.name}]`, 'close')

    this.channel.message?.close()
    this.channel.file?.close()
    this.channel.message = null
    this.channel.file = null

    this.webrtc?.close()
    this.webrtc = null
  }

  public openConnection() {
    this.webrtc = new RTCPeerConnection({
      iceServers: [
        { urls: `stun:${this.context.settings[0].stun}` },
        {
          urls: [`turn:${this.context.settings[0].turn.urls}`],
          username: this.context.settings[0].turn.username,
          credential: this.context.settings[0].turn.password,
        },
      ],
    })
    console.debug(`[${this.name}]`, 'create peer connection')

    this.webrtc.addEventListener('icecandidate', e => this.onIceCandidate(e))
    this.webrtc.addEventListener('connectionstatechange', () =>
      this.onConnectionStateChange()
    )
    this.webrtc.addEventListener('iceconnectionstatechange', () =>
      this.onIceConnectionStateChange()
    )
  }

  public receiveOffer(sdp: RTCSessionDescriptionInit) {
    console.debug(`[${this.name}]`, 'receive offer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
    if (sdp.type !== 'offer') return
    this.webrtc?.createAnswer().then(answer => {
      this.webrtc?.setLocalDescription(answer)
      this.websocket?.send('sdp-answer', {
        id: this.id,
        name: this.name,
        sdp: answer,
      })
    })
  }

  public receiveAnswer(sdp: RTCSessionDescriptionInit) {
    console.debug(`[${this.name}]`, 'receive answer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  public onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.debug(`[${this.name}]`, 'on ice candidate')
    if (!event.candidate || !this.caller) return
    this.websocket?.send('ice-candidate', {
      id: this.id,
      candidate: event.candidate,
      name: this.name,
    })
  }

  public addIceCandidate(candidate: RTCIceCandidateInit) {
    console.debug(`[${this.name}]`, 'add ice candidate')
    this.webrtc?.addIceCandidate(new RTCIceCandidate(candidate))
  }

  public onConnectionStateChange() {
    const state = this.webrtc?.connectionState
    console.debug(`[${this.name}]`, 'connection state change', state)
    if (this.name === 'media-stream') return

    switch (state) {
      case 'connected': {
        this.context.connection[1].setSignal('connected')
        this.context.connection[1].setInfo('')
        break
      }
      case 'disconnected': {
        this.context.connection[1].setSignal('error')
        this.context.connection[1].setMode('other')
        this.context.connection[1].setError('Peer Disconnected')
        this.context.server[0].websocket?.send('disconnect', {
          id: this.id,
        })
        break
      }
      case 'failed': {
        this.context.connection[1].setSignal('error')
        this.context.connection[1].setMode('other')
        this.context.connection[1].setError('Peer Connection Failed')
        this.context.server[0].websocket?.send('disconnect', {
          id: this.id,
        })
        break
      }
    }
  }

  public onIceConnectionStateChange() {
    const state = this.webrtc?.iceConnectionState
    console.debug(`[${this.name}]`, 'ice connection state change', state)
    if (this.name === 'media-stream') return

    switch (state) {
      case 'connected': {
        this.context.connection[1].setSignal('connected')
        this.context.connection[1].setMode('message')
        break
      }
      case 'failed': {
        this.context.connection[1].setSignal('error')
        this.context.connection[1].setError('ICE Gathering Failed')
        break
      }
      case 'checking': {
        this.context.connection[1].setSignal('loading')
        this.context.connection[1].setInfo('ICE Gathering')
        break
      }
    }
  }
}
