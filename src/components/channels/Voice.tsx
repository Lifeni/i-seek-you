import {
  RiCommunicationVideoChatFill,
  RiSystemErrorWarningFill,
} from 'solid-icons/ri'
import { batch, createEffect, createSignal, on, Show } from 'solid-js'
import { useVoice } from '../../context/channels/Voice'
import { useConnection } from '../../context/Connection'
import { useServer } from '../../context/Server'
import { useSettings } from '../../context/Settings'
import { Media } from '../../networks/connection/Media'
import { Subtle } from '../base/Text'
import { Controls } from './voice/Controls'
import { Video } from './voice/Video'

export const Voice = () => {
  const settings = useSettings()
  const servers = useServer()
  const connections = useConnection()

  const [server] = servers
  const [connection, { setMedia }] = connections
  const [voice, { setStream, resetVoice, switchControls }] = useVoice()
  const [error, setError] = createSignal('')

  const isActive = () =>
    voice.controls.camera || voice.controls.microphone || voice.controls.screen
  const hasRemoteMedia = () =>
    connection.streams && connection.streams?.length !== 0

  createEffect(
    on([isActive], ([isActive]) => {
      if (isActive) return
      connection.media?.clear()
      connection.channel?.sendMessage('stream', { action: 'clear' })
      setStream(null)
    })
  )

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

  createEffect(
    on([() => voice.controls.camera], async ([camera]) => {
      if (!connection.media || !isActive()) return
      setError('')
      if (camera) {
        console.debug('[camera]', 'open camera')
        const stream = await window.navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .catch(reason => setError(reason))
        const video = stream?.getVideoTracks()[0]
        const audio = stream?.getAudioTracks()[0]
        connection.media.clear()
        if (audio) {
          if (!voice.controls.microphone) audio.enabled = false
          connection.media?.add(audio, stream)
        }
        if (video) {
          connection.media?.add(video, stream)
          setStream(stream)
        }
        if (voice.controls.screen) switchControls('screen')
      } else {
        console.debug('[camera]', 'close camera')
        if (voice.controls.screen) return
        if (voice.controls.microphone) {
          const stream = await window.navigator.mediaDevices
            .getUserMedia({
              audio: true,
            })
            .catch(reason => setError(reason))
          const audio = stream?.getAudioTracks()[0]
          if (audio) {
            connection.media.clear()
            connection.media?.add(audio, stream)
            setStream(stream)
          }
        }
      }
    })
  )

  createEffect(
    on([() => voice.controls.microphone], async ([microphone]) => {
      if (!connection.media || !isActive()) return
      setError('')
      if (microphone) {
        console.debug('[microphone]', 'open microphone')
        if (voice.controls.camera) {
          const audio = voice.stream?.getAudioTracks()[0]
          if (audio) audio.enabled = true
        } else {
          const stream = await window.navigator.mediaDevices
            .getUserMedia({
              audio: true,
            })
            .catch(reason => setError(reason))
          const audio = stream?.getAudioTracks()[0]
          if (audio) {
            connection.media.clear()
            connection.media?.add(audio, stream)
            setStream(stream)
          }
        }
        if (voice.controls.screen) switchControls('screen')
      } else {
        console.debug('[microphone]', 'close microphone')
        if (voice.controls.screen) return
        if (voice.controls.camera) {
          const audio = voice.stream?.getAudioTracks()[0]
          if (audio) audio.enabled = false
        }
      }
    })
  )

  createEffect(
    on([() => voice.controls.screen], async ([screen]) => {
      if (!connection.media) return
      setError('')
      if (screen) {
        console.debug('[screen]', 'get display media')
        const stream = await window.navigator.mediaDevices
          .getDisplayMedia({
            video: true,
          })
          .catch(reason => setError(reason))
        console.debug('[screen]', 'open screen')
        const video = stream?.getVideoTracks()[0]
        if (video) {
          connection.media?.add(stream.getTracks()[0], stream)
          setStream(stream)
        }
        if (voice.controls.camera) switchControls('camera')
        if (voice.controls.microphone) switchControls('microphone')
      } else {
        console.debug('[screen]', 'close screen')
      }
    })
  )

  return (
    <div
      pos="relative"
      w="full"
      p="x-3 y-2"
      flex="~ col"
      items="center"
      justify="center"
      gap="3"
    >
      <Show when={!error()} fallback={<Error error={error()} />}>
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
              <Video />
            </Show>
            <Show when={hasRemoteMedia()}>
              <Video isRemote />
            </Show>
          </div>
        </Show>
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

interface ErrorProps {
  error: string
}

const Error = (props: ErrorProps) => (
  <div w="full" min-h="60vh" flex="~ 1 col" items="center" justify="center">
    <RiSystemErrorWarningFill
      w="18"
      h="18"
      m="t-12 b-6"
      text="red-500 dark:red-400"
    />
    <h1 text="lg" font="bold">
      Error
    </h1>
    <Subtle>{props.error}</Subtle>
  </div>
)
