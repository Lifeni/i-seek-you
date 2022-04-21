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
import { useConnection } from '../../../context/Connection'
import { useVoice } from '../../../context/media/Voice'
import { IconButton } from '../../base/Button'

export const Controls = () => {
  const [, { setMode }] = useConnection()
  const [voice, { switchControls }] = useVoice()

  const isCamera = () => voice.controls.camera
  const isMicrophone = () => voice.controls.microphone
  const isScreen = () => voice.controls.screen
  const isPicture = () => voice.controls.picture

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~ 1" items="center" justify="start">
        <IconButton
          name="Message"
          icon={RiCommunicationMessage2Fill}
          onClick={() => setMode('message')}
        />
      </div>
      <div flex="~ 1" items="center" justify="center" gap="1">
        <IconButton
          name="Camera"
          icon={isCamera() ? RiMediaCameraFill : RiMediaCameraOffFill}
          isPrimary={isCamera()}
          onClick={() => switchControls('camera')}
        />

        <IconButton
          name="Voice"
          icon={isMicrophone() ? RiMediaMicFill : RiMediaMicOffFill}
          isPrimary={isMicrophone()}
          onClick={() => switchControls('microphone')}
        />

        <IconButton
          name="Share Screen"
          icon={RiDeviceComputerFill}
          isPrimary={isScreen()}
          onClick={() => switchControls('screen')}
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
          onClick={() => switchControls('picture')}
        />
      </div>
    </div>
  )
}
