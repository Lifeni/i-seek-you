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
  RiSystemEyeOffFill,
} from 'solid-icons/ri'
import { createSignal } from 'solid-js'
import { useConnection } from '../../../context/Connection'
import { IconButton } from '../../base/Button'

export const Controls = () => {
  const [, { setMode }] = useConnection()
  const [camera, setCamera] = createSignal(false)
  const [voice, setVoice] = createSignal(false)
  const [screen, setScreen] = createSignal(false)
  const [full, setFull] = createSignal(false)
  const [picture, setPicture] = createSignal(false)

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~ 1" items="center" justify="start">
        <IconButton
          name="Message"
          icon={RiCommunicationMessage2Fill}
          onClick={() => setMode('message')}
        />
      </div>
      <div flex="~ 1" items="center" justify="center">
        <IconButton
          name="Camera"
          icon={camera() ? RiMediaCameraFill : RiMediaCameraOffFill}
          onClick={() => setCamera(v => !v)}
        />

        <IconButton
          name="Voice"
          icon={voice() ? RiMediaMicFill : RiMediaMicOffFill}
          onClick={() => setVoice(v => !v)}
        />

        <IconButton
          name="Share Screen"
          icon={screen() ? RiBusinessSlideshow3Fill : RiSystemEyeOffFill}
          onClick={() => setScreen(v => !v)}
        />
      </div>
      <div flex="~ 1" items="center" justify="end">
        <IconButton
          name="Picture in Picture"
          icon={
            picture()
              ? RiMediaPictureInPictureExitFill
              : RiMediaPictureInPicture2Fill
          }
          onClick={() => setPicture(v => !v)}
        />
        <IconButton
          name="Full Screen"
          icon={full() ? RiMediaFullscreenExitFill : RiMediaFullscreenFill}
          onClick={() => setFull(v => !v)}
        />
      </div>
    </div>
  )
}
