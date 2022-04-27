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
    return this.webrtc?.addTrack(track, stream)
  }

  public replace(sender: RTCRtpSender, track: MediaStreamTrack) {
    console.debug('[media-stream]', 'replace track')
    sender.replaceTrack(track)
  }

  public remove(sender: RTCRtpSender) {
    console.debug('[media-stream]', 'remove track')
    this.webrtc?.removeTrack(sender)
  }

  public clear() {
    console.debug('[media-stream]', 'clear track')
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
