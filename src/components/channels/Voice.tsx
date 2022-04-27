import { RiCommunicationVideoChatFill } from 'solid-icons/ri'
import { batch, createEffect, createSignal, on, Show } from 'solid-js'
import { useConnection } from '../../context/Connection'
import { useVoice } from '../../context/media/Voice'
import { useServer } from '../../context/Server'
import { useSettings } from '../../context/Settings'
import { Media } from '../../networks/peer-connection/Media'
import { Subtle } from '../base/Text'
import { Controls } from './voice/Controls'
import { Video } from './voice/Video'

export const Voice = () => {
  const settings = useSettings()
  const servers = useServer()
  const connections = useConnection()

  const [server] = servers
  const [connection, { setMedia }] = connections
  const [
    voice,
    { setSenders, setStream, resetVoice, switchControls, resetSenders },
  ] = useVoice()

  const [hasAudio, setAudio] = createSignal(false)
  const [hasVideo, setVideo] = createSignal(false)
  const [lock, setLock] = createSignal(false)

  const isActive = () =>
    voice.controls.camera || voice.controls.microphone || voice.controls.screen
  const hasRemoteMedia = () =>
    connection.streams && connection.streams?.length !== 0

  createEffect(
    on([isActive], ([isActive]) => {
      if (isActive) return
      clearVoice()
    })
  )

  const clearVoice = () => {
    connection.media?.clear()
    connection.channel?.send('media-clear')
    setStream(null)
    resetSenders()
  }

  createEffect(
    on([() => connection.mode], ([mode]) => {
      switch (mode) {
        case 'other': {
          batch(() => {
            resetVoice()
            connection.media?.clear()
            setMedia(null)
          })
          break
        }
        case 'voice': {
          if (connection.media) return
          const id = connection.id
          server.websocket?.send('media', { id })
          const media = new Media({
            settings,
            server: servers,
            connection: connections,
            id,
            caller: true,
          })
          setMedia(media)
        }
      }
    })
  )

  const checkVoice = async (open: boolean) => {
    if (!open || (!voice.controls.screen && voice.stream)) return voice.stream
    console.debug('[voice]', 'get user media')
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    setLock(true)
    if (voice.controls.screen) {
      switchControls('screen')
      clearVoice()
    }
    batch(() => {
      setVideo(false)
      setAudio(false)
    })
    setLock(false)
    stream.getTracks().forEach(track => (track.enabled = false))
    setStream(stream)
    return stream
  }

  createEffect(
    on([() => voice.controls.camera], async ([camera]) => {
      if (!connection.media || lock()) return
      const stream = await checkVoice(camera)
      const video = stream?.getVideoTracks()[0]
      if (!video) return

      if (camera) {
        console.debug('[camera]', 'open camera')
        video.enabled = true
        setVideo(true)
      } else {
        console.debug('[camera]', 'close camera')
        video.enabled = false
        setVideo(false)
      }

      if (voice.senders.camera)
        connection.media?.replace(voice.senders.camera, video)
      else setSenders('camera', connection.media?.add(video, stream))
    })
  )

  createEffect(
    on([() => voice.controls.microphone], async ([microphone]) => {
      if (!connection.media || lock()) return
      const stream = await checkVoice(microphone)
      const audio = stream?.getAudioTracks()[0]
      if (!audio) return

      if (microphone) {
        console.debug('[microphone]', 'open microphone')
        audio.enabled = true
        setAudio(true)
      } else {
        console.debug('[microphone]', 'close microphone')
        audio.enabled = false
        setAudio(false)
      }

      if (voice.senders.microphone)
        connection.media?.replace(voice.senders.microphone, audio)
      else setSenders('microphone', connection.media?.add(audio, stream))
    })
  )

  createEffect(
    on([() => voice.controls.screen], async ([screen]) => {
      if (!connection.media || lock()) return
      if (screen) {
        console.debug('[screen]', 'get display media')
        const stream = await window.navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        console.debug('[screen]', 'open screen')
        setLock(true)
        if (voice.controls.camera) switchControls('camera')
        if (voice.controls.microphone) switchControls('microphone')
        if (voice.controls.camera || voice.controls.microphone) clearVoice()
        setVideo(true)
        setStream(stream)
        setLock(false)
        const sender = connection.media?.add(stream.getTracks()[0], stream)
        setSenders('screen', sender)
      } else {
        console.debug('[screen]', 'close screen')
        if (voice.senders.screen) {
          connection.media?.remove(voice.senders.screen)
          setSenders('screen', null)
        }
      }
    })
  )

  return (
    <div
      w="full"
      p="x-3 y-2"
      flex="~ col"
      items="center"
      justify="center"
      gap="3"
    >
      <Show when={isActive() || hasRemoteMedia()} fallback={<Placeholder />}>
        <div
          w="full"
          min-h="60vh"
          max-h="60vh"
          p="x-2 sm:x-3"
          flex="~ 1 col sm:row"
          items="center"
          justify="center"
          gap="3"
        >
          <Show when={isActive()}>
            <Video hasAudio={hasAudio()} hasVideo={hasVideo()} />
          </Show>
          <Show when={hasRemoteMedia()}>
            <Video isRemote />
          </Show>
        </div>
      </Show>
      <div p="y-1" w="full" flex="~" items="end" gap="4">
        <Controls />
      </div>
    </div>
  )
}

const Placeholder = () => {
  const [connection] = useConnection()

  return (
    <div w="full" min-h="60vh" flex="~ 1 col" items="center" justify="center">
      <RiCommunicationVideoChatFill
        w="18"
        h="18"
        m="t-12 b-6"
        text="light-800 dark:dark-200"
      />
      <h1 text="lg" font="bold">
        Connected to #{connection.id}
      </h1>
      <Subtle>You can send messages or video chat now.</Subtle>
    </div>
  )
}
