import { type IconTypes } from 'solid-icons'
import {
  RiBusinessSlideshow3Fill,
  RiCommunicationMessage2Fill,
  RiMediaCameraFill,
  RiMediaCameraOffFill,
  RiMediaFullscreenExitFill,
  RiMediaFullscreenFill,
  RiMediaMicFill,
  RiMediaMicOffFill,
  RiMediaPictureInPicture2Fill,
  RiMediaPictureInPictureExitFill,
} from 'solid-icons/ri'
import { createSignal } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useChannel } from '../../../context/Channel'

export const Controls = () => {
  const [channel, { setMode }] = useChannel()
  const [camera, setCamera] = createSignal(false)
  const [voice, setVoice] = createSignal(false)
  const [screen, setScreen] = createSignal(false)
  const [full, setFull] = createSignal(false)
  const [picture, setPicture] = createSignal(false)

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~ 1" items="center" justify="start">
        <Action
          title="Message"
          icon={RiCommunicationMessage2Fill}
          onClick={() => setMode('message')}
        />
      </div>
      <div flex="~ 1" items="center" justify="center">
        <Action
          title="Camera"
          icon={camera() ? RiMediaCameraFill : RiMediaCameraOffFill}
          onClick={() => setCamera(v => !v)}
        />

        <Action
          title="Voice"
          icon={voice() ? RiMediaMicFill : RiMediaMicOffFill}
          onClick={() => setVoice(v => !v)}
        />

        <Action
          title="Share Screen"
          icon={RiBusinessSlideshow3Fill}
          onClick={() => setScreen(v => !v)}
        />
      </div>
      <div flex="~ 1" items="center" justify="end">
        <Action
          title="Picture in Picture"
          icon={
            picture()
              ? RiMediaPictureInPictureExitFill
              : RiMediaPictureInPicture2Fill
          }
          onClick={() => setPicture(v => !v)}
        />
        <Action
          title="Full Screen"
          icon={full() ? RiMediaFullscreenExitFill : RiMediaFullscreenFill}
          onClick={() => setFull(v => !v)}
        />
      </div>
    </div>
  )
}

interface ActionProps {
  title: string
  icon: IconTypes
  onClick: () => void
}

const Action = (props: ActionProps) => (
  <button
    role="tooltip"
    aria-label={props.title}
    data-position="top"
    w="11"
    h="11"
    flex="~"
    justify="center"
    items="center"
    rounded="full"
    text="inherit"
    bg="hover:(light-600 dark:dark-400)"
    onClick={props.onClick}
  >
    <Dynamic component={props.icon} w="5" h="5" />
  </button>
)
