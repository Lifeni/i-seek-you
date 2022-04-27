import { PeerConnection, PeerConnectionProps } from '../PeerConnection'

interface DataChannelProps extends Omit<PeerConnectionProps, 'name'> {}

export class DataChannel extends PeerConnection {
  constructor(props: DataChannelProps) {
    super({ ...props, name: 'data-channel' })

    if (this.caller) {
      this.openDataChannel()
    } else {
      console.debug('[data-channel]', 'listen data channel')
      this.webrtc?.addEventListener('datachannel', e => this.onChannelOpen(e))
    }
  }

  public openDataChannel() {
    console.debug('[data-channel]', 'open data channel')
    if (!this.caller) return
    this.channel = this.webrtc?.createDataChannel('data-channel', {
      ordered: true,
    })
    this.channel?.addEventListener('open', e =>
      this.onChannelOpen(e as RTCDataChannelEvent)
    )

    console.debug('[data-channel]', 'send offer ->', this.id)
    this.webrtc?.createOffer().then(offer => {
      this.webrtc?.setLocalDescription(offer)
      this.websocket?.send('sdp-offer', {
        id: this.id,
        name: 'data-channel',
        sdp: offer,
      })
    })
  }

  public send<T>(type: string, message?: T) {
    console.debug('[data-channel]', 'send ->', type)
    this.channel?.send(JSON.stringify({ type, ...message }))
  }

  public onChannelOpen(event: RTCDataChannelEvent) {
    console.debug('[data-channel]', 'channel open')
    this.channel = event.channel || event.target
    this.channel.addEventListener('error', () => this.onChannelError())
    this.channel.addEventListener('message', e => this.onChannelMessage(e))
    this.channel.addEventListener('close', () => this.onChannelClose())
  }

  public onChannelMessage(event: MessageEvent) {
    const message = JSON.parse(event.data)
    console.debug('[data-channel]', 'channel message ->', message.type)
    switch (message.type) {
      case 'text': {
        this.context.connection[1].addMessage(message)
        break
      }
      case 'file': {
        this.context.connection[1].addMessage(message)
        break
      }
      case 'media-clear': {
        this.context.connection[1].resetStreams()
        break
      }
    }
  }

  public onChannelClose() {
    console.debug('[data-channel]', 'channel close')
  }

  public onChannelError() {
    console.debug('[data-channel]', 'channel error')
  }
}
