import { RiMediaMicFill } from 'solid-icons/ri'
import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js'

interface VideoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  stream: MediaStream | null
}

export const Video = (props: VideoProps) => {
  const [video, setVideo] = createSignal<HTMLVideoElement>()
  const [audio, setAudio] = createSignal<HTMLAudioElement>()
  const isAudio = () =>
    !props.stream?.getTracks().some(track => track.kind === 'video')

  createEffect(() => {
    const target = isAudio() ? audio() : video()
    if (!target || !props.stream) return
    target.srcObject = props.stream
    target.play()
  })

  onCleanup(() => {
    const target = isAudio() ? audio() : video()
    if (!target) return
    target.pause()
    target.srcObject = null
  })

  return (
    <Show
      when={isAudio()}
      fallback={
        <div
          flex="~ 1 wrap"
          rounded="md"
          overflow="hidden"
          bg="light-600 dark:dark-400"
          shadow="lg"
        >
          <video ref={setVideo} w="full" h="full" controls />
        </div>
      }
    >
      <div
        flex="~ 1"
        p="6"
        rounded="md"
        overflow="hidden"
        bg="light-600 dark:dark-400"
      >
        <RiMediaMicFill w="8" h="8" text="gray-500 dark:gray-400" />
        <audio ref={setAudio} w="full" h="full" />
      </div>
    </Show>
  )
}
