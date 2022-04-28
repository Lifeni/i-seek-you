import { FileBlob } from '../../..'
import { PeerConnection, PeerConnectionProps } from '../PeerConnection'

interface DataChannelProps extends Omit<PeerConnectionProps, 'name'> {}

export class DataChannel extends PeerConnection {
  public buffer: ArrayBuffer[] = []
  public size = 0
  public file: FileBlob[] = []

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

    const options = { ordered: true }
    this.channel.message = this.webrtc?.createDataChannel('message', options)
    this.channel.file = this.webrtc?.createDataChannel('file', options)

    if (this.channel.file) {
      this.channel.file.binaryType = 'arraybuffer'
      this.channel.file.addEventListener('open', e =>
        this.onChannelOpen(e as RTCDataChannelEvent)
      )
    }

    if (this.channel.message)
      this.channel.message.addEventListener('open', e =>
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

  public sendMessage<T>(type: string, message?: T) {
    console.debug('[data-channel]', 'send ->', type)
    this.channel?.message?.send(JSON.stringify({ type, ...message }))
  }

  public sendFile(file: ArrayBuffer) {
    console.debug('[data-channel]', 'send file')
    this.channel?.file?.send(file)
  }

  public onChannelOpen(event: RTCDataChannelEvent) {
    const channel = event.channel || event.target
    console.debug('[data-channel]', 'channel open ->', channel.label)

    switch (channel.label) {
      case 'message': {
        this.channel.message = channel
        const message = this.channel.message
        message.addEventListener('error', e => this.onChannelError(e))
        message.addEventListener('message', e => this.onChannelMessage(e))
        message.addEventListener('close', () => this.onChannelClose())
        break
      }
      case 'file': {
        this.channel.file = channel
        const file = this.channel.file
        file.addEventListener('error', e => this.onChannelError(e))
        file.addEventListener('message', e => this.onFileChannelMessage(e))
        file.addEventListener('close', () => this.onChannelClose())
        break
      }
    }
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
        this.context.connection[1].addFile({
          ...message.file,
          progress: 0,
          blob: null,
        })
        this.file.push(message.file)
        break
      }
      case 'stream': {
        switch (message.action) {
          case 'clear': {
            this.context.connection[1].resetStreams()
            break
          }
        }
        break
      }
    }
  }

  public onFileChannelMessage(event: MessageEvent) {
    this.buffer.push(event.data as ArrayBuffer)
    this.size += event.data.byteLength
    const file = this.file[0]
    if (!file) return
    const progress = (this.size / file.size) * 100
    this.context.connection[1].setProgress(file.id, progress)
    console.debug('[file-channel]', 'receive buffer ->', progress)

    if (file.size === this.size) {
      console.debug('[file-channel]', 'receive file ->', file.name)
      const blob = new Blob(this.buffer, { type: file.type })
      this.context.connection[1].setBlob(file.id, blob)
      this.buffer = []
      this.size = 0
      this.file.pop()
    }
  }

  public onChannelClose() {
    console.debug('[data-channel]', 'channel close')
  }

  public onChannelError(event: Event) {
    console.debug('[data-channel]', 'channel error')
    console.error((event as ErrorEvent).error)
  }
}
