import { PeerConnection, PeerConnectionProps } from '../PeerConnection'

interface MediaProps extends Omit<PeerConnectionProps, 'name'> {}

export class Media extends PeerConnection {
  constructor(props: MediaProps) {
    super({ ...props, name: 'media-stream' })

    console.debug('[media-stream]', 'listen track')
    this.webrtc?.addEventListener('track', e => this.onTrack(e))
    this.webrtc?.addEventListener('negotiationneeded', () =>
      this.onNegotiationNeeded()
    )
  }

  public add(track: MediaStreamTrack, stream: MediaStream) {
    console.debug('[media-stream]', 'add track')
    this.webrtc?.addTrack(track, stream)
  }

  public remove() {
    console.debug('[media-stream]', 'remove track')
    this.webrtc?.getSenders().forEach(sender => {
      this.webrtc?.removeTrack(sender)
    })
  }

  public onTrack(event: RTCTrackEvent) {
    console.debug('[media-stream]', 'receive track')
    this.context.connection[1].setStreams(event.streams)
  }

  public onNegotiationNeeded() {
    console.debug('[media-stream]', 'on negotiation needed')
    this.webrtc?.createOffer().then(offer => {
      this.webrtc?.setLocalDescription(offer)
      this.websocket?.send('sdp-offer', {
        id: this.id,
        name: 'media-stream',
        sdp: offer,
      })
    })
  }
}
