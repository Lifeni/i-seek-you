import {
  RiCommunicationMessage2Fill,
  RiDeviceComputerFill,
  RiDeviceShutDownFill,
  RiMediaCameraFill,
  RiMediaCameraOffFill,
  RiMediaMicFill,
  RiMediaMicOffFill,
} from 'solid-icons/ri'
import { useConnection } from '../../../context/Connection'
import { useVoice } from '../../../context/media/Voice'
import { IconButton } from '../../base/Button'

export const Controls = () => {
  const [connection, { setMode, setMedia }] = useConnection()
  const [voice, { switchControls, resetVoice }] = useVoice()

  const isCamera = () => voice.controls.camera
  const isMicrophone = () => voice.controls.microphone
  const isScreen = () => voice.controls.screen

  const handleHangUp = () => {
    resetVoice()
    connection.media?.clear()
    setMedia(null)
    setMode('message')
  }

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
          name="Hang Up"
          icon={RiDeviceShutDownFill}
          onClick={() => handleHangUp()}
        />
      </div>
    </div>
  )
}
