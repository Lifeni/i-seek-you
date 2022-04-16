import { type Channel } from '../context/Channel'
import { type Connection } from '../context/Connection'
import { type Buffer } from '../context/Buffer'
import { Signaling } from './Signaling'

interface PeerConnectionProps {
  connection: Readonly<Connection>
  channel: Readonly<Channel>
  buffer: Readonly<Buffer>
  caller?: Readonly<boolean>
  id: string
}

export class PeerConnection {
  public webrtc?: RTCPeerConnection | null
  public channel?: RTCDataChannel | null
  public caller: Readonly<boolean>
  public id: Readonly<string>
  public websocket: InstanceType<typeof Signaling> | null
  public context: {
    connection: Readonly<Connection>
    channel: Readonly<Channel>
    buffer: Readonly<Buffer>
  }

  static config = {
    sdpSemantics: 'unified-plan',
    iceServers: [{ urls: 'stun:localhost:8082' }],
  }

  constructor({
    connection,
    id,
    channel,
    caller,
    buffer,
  }: PeerConnectionProps) {
    this.context = { connection, buffer, channel }
    this.websocket = connection[0].signaling
    this.caller = !!caller
    this.id = id

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
    this.webrtc = new RTCPeerConnection(PeerConnection.config)
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
    if (this.caller) {
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
  }

  public receiveOffer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receive offer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
    if (sdp.type === 'offer') {
      this.webrtc?.createAnswer().then(answer => {
        this.webrtc?.setLocalDescription(answer)
        this.websocket?.send('sdp-answer', {
          id: this.id,
          sdp: answer,
        })
      })
    }
  }

  public receiveAnswer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receive answer')
    this.webrtc?.setRemoteDescription(new RTCSessionDescription(sdp))
    this.context.channel[1].setSignal('ice')
  }

  public onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.debug('[webrtc]', 'receive ice candidate')
    this.context.channel[1].setSignal('ice')
    if (event.candidate)
      this.websocket?.send('ice-candidate', {
        id: this.id,
        candidate: event.candidate,
      })
  }

  public addIceCandidate(candidate: RTCIceCandidateInit) {
    console.debug('[webrtc]', 'add ice candidate')
    this.webrtc?.addIceCandidate(new RTCIceCandidate(candidate))
    this.context.channel[1].setSignal('connected')
    this.context.channel[1].setMode('message')
  }

  public onConnectionStateChange() {
    const state = this.webrtc?.connectionState
    console.debug('[webrtc]', 'connection state change', state)

    switch (state) {
      case 'connected': {
        this.context.channel[1].setSignal('connected')
        this.context.channel[1].setInfo('')
        break
      }
      case 'disconnected': {
        this.context.channel[1].setSignal('error')
        this.context.channel[1].setMode('other')
        this.context.channel[1].setError('Peer Disconnected')
        this.context.connection[0].signaling?.send('disconnect', {
          id: this.id,
        })
        break
      }
      case 'failed': {
        this.context.channel[1].setSignal('error')
        this.context.channel[1].setMode('other')
        this.context.channel[1].setError('Peer Connection Failed')
        this.context.connection[0].signaling?.send('disconnect', {
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
        this.context.channel[1].setSignal('error')
        this.context.channel[1].setError('ICE Gathering Failed')
        break
      }
      default: {
        this.context.channel[1].setSignal('ice')
        this.context.channel[1].setInfo('ICE Gathering')
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
        this.context.buffer[1].addMessage(message)
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
