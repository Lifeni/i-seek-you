import {
  RiMediaMic2Fill,
  RiMediaMicFill,
  RiMediaMicOffFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js'
import { useConnection } from '../../../context/Connection'
import { useVoice } from '../../../context/media/Voice'

interface VideoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  hasAudio?: boolean
  hasVideo?: boolean
  isRemote?: boolean
}

export const Video = (props: VideoProps) => {
  const [connection] = useConnection()
  const [voice] = useVoice()
  const [video, setVideo] = createSignal<HTMLVideoElement>()
  const [audio, setAudio] = createSignal<HTMLAudioElement>()
  const [volume, setVolume] = createSignal(0)

  const currentStream = () =>
    props.isRemote ? connection.streams?.[0] : voice.stream
  const hasAudio = () =>
    props.hasAudio || currentStream()?.getAudioTracks?.()?.[0]?.enabled
  const hasVideo = () =>
    props.hasVideo || currentStream()?.getVideoTracks?.()?.[0]?.enabled

  createEffect(() => {
    const target = hasVideo() ? video() : hasAudio() ? audio() : null
    const stream = currentStream()
    if (!target || !stream) return
    target.srcObject = stream
    target.play()
  })

  createEffect(() => {
    const stream = currentStream()
    if (!stream || stream.getAudioTracks().length === 0) return
    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    source.connect(analyser)

    const arr = new Uint8Array(analyser.frequencyBinCount)
    const calc = () => {
      analyser.getByteFrequencyData(arr)
      const volume = Math.floor((Math.max(...arr) / 255) * 100)
      setVolume(volume)
    }
    calc()
    setInterval(calc, 200)
  })

  onCleanup(() =>
    [video(), audio()].map(target => {
      if (!target) return
      target.srcObject = null
    })
  )

  return (
    <div
      class="group"
      pos="relative"
      w="full"
      h="full"
      max-h="full"
      flex="~ 1"
      items="center"
      justify="between"
      rounded="md"
      overflow="hidden"
      text={hasVideo() ? 'light-100' : 'inherit'}
      bg={hasVideo() ? 'black' : 'light-600 dark:dark-400'}
    >
      <div
        pos="absolute"
        top="0"
        left="0"
        w="full"
        p="x-5 y-3"
        display="invisible"
        opacity="0"
        flex="~"
        items="center"
        text="inherit"
        font="bold"
        group-hover="visible opacity-100"
        gap="2"
        transition="opacity"
      >
        <Show when={props.isRemote} fallback={<span>Local</span>}>
          <span>Remote</span>
        </Show>

        <Show
          when={hasAudio()}
          fallback={<RiMediaMicOffFill w="4.5" h="4.5" />}
        >
          <RiMediaMicFill w="4.5" h="4.5" />
        </Show>
      </div>

      <Show when={hasVideo()}>
        <video
          ref={setVideo}
          w="full"
          h="full"
          controls
          muted={!props.isRemote}
          rounded="~"
        />
      </Show>

      <Show when={!hasVideo() && hasAudio()}>
        <div w="full" flex="~ 1 col" items="center" justify="between">
          <div
            pos="relative"
            m="t-2 sm:t-12 b-2 smb-4"
            text={
              volume() > 2
                ? 'rose-500 dark:rose-200'
                : 'light-800 dark:dark-200'
            }
          >
            <RiMediaMic2Fill w="18" h="18" />

            <div
              pos="absolute"
              top="0.5"
              left="1/2"
              w="8"
              h="12.5"
              bg="light-800 dark:dark-200"
              flex="~"
              items="end"
              justify="center"
              rounded="full"
              transform="~ -translate-x-1/2"
              overflow="hidden"
            >
              <div
                bg="rose-500 dark:rose-200"
                w="full"
                style={{ height: `${volume()}%` }}
              />
            </div>
          </div>

          <Show
            when={props.isRemote}
            fallback={
              <h1 text="lg inherit" font="bold">
                You are Talking
              </h1>
            }
          >
            <h1 text="lg inherit" font="bold">
              #{connection.id} is Talking
            </h1>
          </Show>

          <audio
            ref={setAudio}
            controls
            muted={!props.isRemote}
            pos="absolute"
            bottom="0"
            left="0"
            w="full"
            display="invisible"
            opacity="0"
            group-hover="visible opacity-100"
            transition="opacity"
          />
        </div>
      </Show>
    </div>
  )
}
