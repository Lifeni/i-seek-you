import {
  RiCommunicationMessage2Fill,
  RiDeviceComputerFill,
  RiMediaCameraFill,
  RiMediaCameraOffFill,
  RiMediaMicFill,
  RiMediaMicOffFill,
  RiMediaPictureInPicture2Fill,
  RiMediaPictureInPictureExitFill,
} from 'solid-icons/ri'
import { createSignal } from 'solid-js'
import { useConnection } from '../../../context/Connection'
import { IconButton } from '../../base/Button'

export const Controls = () => {
  const [, { setMode }] = useConnection()
  const [isCamera, setCamera] = createSignal(false)
  const [isVoice, setVoice] = createSignal(false)
  const [isScreen, setScreen] = createSignal(false)
  const [isPicture, setPicture] = createSignal(false)

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
          icon={isCamera() ? RiMediaCameraFill : RiMediaCameraOffFill}
          isPrimary={isCamera()}
          onClick={() => setCamera(v => !v)}
        />

        <IconButton
          name="Voice"
          icon={isVoice() ? RiMediaMicFill : RiMediaMicOffFill}
          isPrimary={isVoice()}
          onClick={() => setVoice(v => !v)}
        />

        <IconButton
          name="Share Screen"
          icon={RiDeviceComputerFill}
          isPrimary={isScreen()}
          onClick={() => setScreen(v => !v)}
        />
      </div>
      <div flex="~ 1" items="center" justify="end">
        <IconButton
          name="Picture in Picture"
          icon={
            isPicture()
              ? RiMediaPictureInPictureExitFill
              : RiMediaPictureInPicture2Fill
          }
          onClick={() => setPicture(v => !v)}
        />
      </div>
    </div>
  )
}
