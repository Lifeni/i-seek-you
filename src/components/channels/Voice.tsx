import {
  RiCommunicationVideoChatFill,
  RiSystemErrorWarningFill,
} from 'solid-icons/ri'
import { batch, createEffect, createSignal, For, on, Show } from 'solid-js'
import { useConnection } from '../../context/Connection'
import { useVoice } from '../../context/media/Voice'
import { Subtle } from '../base/Text'
import { Controls } from './voice/Controls'
import { Video } from './voice/Video'

export const Voice = () => {
  const [connection] = useConnection()
  const [voice, { resetVoice }] = useVoice()
  const [stream, setStream] = createSignal<MediaStream | null>(null)
  const [screen, setScreen] = createSignal<MediaStream | null>(null)
  const [isError, setError] = createSignal(false)

  const isActive = () =>
    voice.controls.camera || voice.controls.microphone || voice.controls.screen
  const hasRemoteMedia = () =>
    connection.streams && connection.streams?.length !== 0

  createEffect(
    on([() => connection.mode === 'other'], ([signal]) => {
      if (!signal) return
      batch(() => {
        setStream(null)
        setScreen(null)
        connection.webrtc?.remove()
        resetVoice()
      })
    })
  )

  createEffect(
    on(
      [() => voice.controls.camera, () => voice.controls.microphone],
      ([camera, microphone]) => {
        if (camera || microphone) {
          window.navigator.mediaDevices
            .getUserMedia({ video: camera, audio: microphone })
            .then(stream => {
              setStream(stream)
              stream.getTracks().forEach(track => {
                connection.webrtc?.add(track, stream)
              })
              setError(false)
            })
            .catch(() => setError(true))
        } else {
          stream()
            ?.getTracks()
            .forEach(track => track.stop())
          setStream(null)
        }
      }
    )
  )

  createEffect(
    on([() => voice.controls.screen], ([screen]) => {
      if (screen) {
        window.navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then(stream => {
            setScreen(stream)
            stream.getTracks().forEach(track => {
              connection.webrtc?.add(track, stream)
            })
            setError(false)
          })
          .catch(() => setError(true))
      } else {
        stream()
          ?.getTracks()
          .forEach(track => track.stop())
        setScreen(null)
      }
    })
  )

  return (
    <div
      w="full"
      h="70vh"
      p="x-3 y-2"
      flex="~ col"
      items="center"
      justify="center"
      gap="3"
    >
      <Show when={isError()}>
        <Error />
      </Show>
      <Show when={isActive() || hasRemoteMedia()} fallback={<Placeholder />}>
        <div p="x-3 y-2" flex="~ 1" items="center" justify="center" gap="3">
          <Show when={stream()}>
            <Video stream={stream()} />
          </Show>
          <Show when={screen()}>
            <Video stream={screen()} />
          </Show>
          <Show when={hasRemoteMedia()}>
            <For each={connection.streams}>
              {stream => <Video stream={stream} />}
            </For>
          </Show>
        </div>
      </Show>
      <div p="y-1" w="full" flex="~" items="end" gap="4">
        <Controls />
      </div>
    </div>
  )
}

const Error = () => (
  <div flex="~ 1 col" items="center" justify="center">
    <RiSystemErrorWarningFill
      w="18"
      h="18"
      m="t-12 b-6"
      text="red-500 dark:red-400"
    />
    <h1 text="lg" font="bold">
      Permission Denied
    </h1>
    <Subtle>Unable to connect your webcam or microphone.</Subtle>
  </div>
)

const Placeholder = () => {
  const [connection] = useConnection()

  return (
    <div flex="~ 1 col" items="center" justify="center">
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
