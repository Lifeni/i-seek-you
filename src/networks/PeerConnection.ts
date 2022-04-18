import { type Connection } from '../context/Connection'
import { type Server } from '../context/Server'
import { type Settings } from '../context/Settings'
import { type Signaling } from './Signaling'

interface PeerConnectionProps {
  settings: Readonly<Settings>
  server: Readonly<Server>
  connection: Readonly<Connection>
  id: string
  caller?: Readonly<boolean>
}

export class PeerConnection {
  public webrtc?: RTCPeerConnection | null
  public websocket: InstanceType<typeof Signaling> | null
  public channel?: RTCDataChannel | null

  public id: Readonly<string>
  public caller: Readonly<boolean>

  public context: {
    settings: Readonly<Settings>
    server: Readonly<Server>
    connection: Readonly<Connection>
  }

  constructor({
    settings,
    server,
    connection,
    id,
    caller,
  }: PeerConnectionProps) {
    this.context = { settings, server, connection }
    this.websocket = server[0].websocket
    this.id = id
    this.caller = !!caller

    this.openConnection()
    if (this.caller) this.openDataChannel()
    else {
      console.debug('[webrtc]', 'listen data channel')
      this.webrtc?.addEventListener('datachannel', e => this.onChannelOpen(e))
    }
  }

  public close() {
    console.debug('[webrtc]', 'close')
    this.channel?.close()
    this.channel = null
    this.webrtc?.close()
    this.webrtc = null
  }

  public openConnection() {
    this.webrtc = new RTCPeerConnection({
      iceServers: [
        { urls: `stun:${this.context.settings[0].stun}` },
        {
          urls: `turn:${this.context.settings[0].turn.urls}`,
          username: this.context.settings[0].turn.username,
          credential: this.context.settings[0].turn.password,
        },
      ],
    })
    console.debug('[webrtc]', 'create peer connection')

    this.webrtc.addEventListener('icecandidate', e => this.onIceCandidate(e))
    this.webrtc.addEventListener('connectionstatechange', () =>
      this.onConnectionStateChange()
    )
    this.webrtc.addEventListener('iceconnectionstatechange', () =>
      this.onIceConnectionStateChange()
    )
  }

  public openDataChannel() {
    console.debug('[webrtc]', 'open data channel')
    if (!this.caller) return
    this.channel = this.webrtc?.createDataChannel('data-channel', {
      ordered: true,
    })
    this.channel?.addEventListener('open', e =>
      this.onChannelOpen(e as RTCDataChannelEvent)
    )

    console.debug('[webrtc]', 'send offer -', this.id)
    this.webrtc?.createOffer().then(offer => {
      this.webrtc?.setLocalDescription(offer)
      this.websocket?.send('sdp-offer', { id: this.id, sdp: offer })
    })
  }

  public receiveOffer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receive offer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
    if (sdp.type !== 'offer') return
    this.webrtc?.createAnswer().then(answer => {
      this.webrtc?.setLocalDescription(answer)
      this.websocket?.send('sdp-answer', {
        id: this.id,
        sdp: answer,
      })
    })
  }

  public receiveAnswer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receive answer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
    this.context.connection[1].setSignal('ice')
  }

  public onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.debug('[webrtc]', 'receive ice candidate')
    this.context.connection[1].setSignal('ice')
    if (!event.candidate) return
    this.websocket?.send('ice-candidate', {
      id: this.id,
      candidate: event.candidate,
    })
  }

  public addIceCandidate(candidate: RTCIceCandidateInit) {
    console.debug('[webrtc]', 'add ice candidate')
    this.webrtc?.addIceCandidate(new RTCIceCandidate(candidate))
    this.context.connection[1].setSignal('connected')
    this.context.connection[1].setMode('message')
  }

  public onConnectionStateChange() {
    const state = this.webrtc?.connectionState
    console.debug('[webrtc]', 'connection state change', state)

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
    console.debug('[webrtc]', 'ice connection state change', state)

    switch (state) {
      case 'failed': {
        this.context.connection[1].setSignal('error')
        this.context.connection[1].setError('ICE Gathering Failed')
        break
      }
      default: {
        this.context.connection[1].setSignal('ice')
        this.context.connection[1].setInfo('ICE Gathering')
        break
      }
    }
  }

  public send<T>(type: string, message?: T) {
    console.debug('[webrtc]', 'send -', type)
    this.channel?.send(JSON.stringify({ type, ...message }))
  }

  public onChannelOpen(event: RTCDataChannelEvent) {
    console.debug('[webrtc]', 'channel open')
    this.channel = event.channel || event.target
    this.channel.addEventListener('error', () => this.onChannelError())
    this.channel.addEventListener('message', e => this.onChannelMessage(e))
    this.channel.addEventListener('close', () => this.onChannelClose())
  }

  public onChannelMessage(event: MessageEvent) {
    const message = JSON.parse(event.data)
    console.debug('[webrtc]', 'channel message -', message.type)
    switch (message.type) {
      case 'text': {
        this.context.connection[1].addMessage(message)
        break
      }
    }
  }

  public onChannelClose() {
    console.debug('[webrtc]', 'channel close')
  }

  public onChannelError() {
    console.debug('[webrtc]', 'channel error')
  }
}
