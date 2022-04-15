import { type Channel, useChannel } from '../context/Channel'
import { type Connection, useConnection } from '../context/Connection'
import { Signaling } from './Signaling'

export class PeerConnection {
  public webrtc: RTCPeerConnection

  public connection: Readonly<Connection>
  public channel: Readonly<Channel>
  public signaling: InstanceType<typeof Signaling> | null

  constructor() {
    this.connection = useConnection()
    this.channel = useChannel()
    this.signaling = this.connection[0].signaling

    this.webrtc = new RTCPeerConnection()
    console.debug('[webrtc]', 'creating peer connection')

    this.webrtc.addEventListener('icecandidate', this.onIceCandidate)
    this.webrtc.addEventListener(
      'connectionstatechange',
      this.onConnectionStateChange
    )
    this.webrtc.addEventListener(
      'iceconnectionstatechange',
      this.onIceConnectionStateChange
    )
  }

  public sendOffer(id: string) {
    console.debug('[webrtc]', 'sending offer', id)
    this.webrtc.createOffer().then(offer => {
      this.webrtc.setLocalDescription(offer)
      this.signaling?.send('sdp-offer', { id, sdp: offer })
    })
  }

  public receiveOffer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receiving offer', sdp)
    this.webrtc.setRemoteDescription(new RTCSessionDescription(sdp))
    if (this.webrtc.remoteDescription?.type === 'offer') {
      this.webrtc.createAnswer().then(answer => {
        this.webrtc.setLocalDescription(answer)
        this.signaling?.send('sdp-answer', {
          id: this.channel[0].id,
          sdp: answer,
        })
      })
    }
  }

  public receiveAnswer(sdp: RTCSessionDescriptionInit) {
    console.debug('[webrtc]', 'receiving answer', sdp)
    this.webrtc.setRemoteDescription(new RTCSessionDescription(sdp))
    this.channel[1].setSignal('ice')
  }

  public onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.debug('[webrtc]', 'received ice candidate', event)
    this.channel[1].setSignal('ice')
    if (event.candidate)
      this.signaling?.send('ice-candidate', {
        id: this.channel[0].peer.id,
        candidate: event.candidate,
      })
  }

  public addIceCandidate(candidate: RTCIceCandidateInit) {
    console.debug('[webrtc]', 'adding ice candidate', candidate)
    this.webrtc.addIceCandidate(new RTCIceCandidate(candidate))
  }

  public onConnectionStateChange() {
    const state = this.webrtc.connectionState
    console.debug('[webrtc]', 'connection state change', state)

    switch (state) {
      case 'connected': {
        this.channel[1].setSignal('loading')
        this.channel[1].setInfo('Peer Connected')
        break
      }
      case 'disconnected': {
        this.channel[1].setSignal('error')
        this.channel[1].setError('Peer Disconnected')
        break
      }
      case 'failed': {
        this.channel[1].setSignal('error')
        this.channel[1].setError('Peer Connection Failed')
        break
      }
    }
  }

  public onIceConnectionStateChange() {
    const state = this.webrtc.iceConnectionState
    console.debug('[webrtc]', 'ice connection state change', state)

    switch (state) {
      case 'failed': {
        this.channel[1].setSignal('error')
        this.channel[1].setError('Ice Gathering Failed')
        break
      }
      default: {
        this.channel[1].setSignal('ice')
        this.channel[1].setInfo('Ice Gathering')
        break
      }
    }
  }
}
