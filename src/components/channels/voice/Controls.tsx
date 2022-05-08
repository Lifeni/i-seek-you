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
import { useVoice } from '../../../context/channels/Voice'
import { IconButton } from '../../base/Button'
import { useI18n } from '@solid-primitives/i18n'

export const Controls = () => {
  const [t] = useI18n()
  const [connection, { setMode, setMedia }] = useConnection()
  const [voice, { switchControls, resetVoice }] = useVoice()

  const isCamera = () => voice.controls.camera
  const isMicrophone = () => voice.controls.microphone
  const isScreen = () => voice.controls.screen

  const handleHangUp = () => {
    resetVoice()
    connection.channel?.sendMessage('stream', { action: 'hang-up' })
    connection.media?.clear()
    setMedia(null)
    setMode('message')
  }

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~ 1" items="center" justify="start">
        <IconButton
          name={t('voice_message')}
          icon={RiCommunicationMessage2Fill}
          onClick={() => setMode('message')}
        />
      </div>
      <div flex="~ 1" items="center" justify="center" gap="1">
        <IconButton
          name={t('voice_camera')}
          icon={isCamera() ? RiMediaCameraFill : RiMediaCameraOffFill}
          isPrimary={isCamera()}
          onClick={() => switchControls('camera')}
        />

        <IconButton
          name={t('voice_microphone')}
          icon={isMicrophone() ? RiMediaMicFill : RiMediaMicOffFill}
          isPrimary={isMicrophone()}
          onClick={() => switchControls('microphone')}
        />

        <IconButton
          name={t('voice_screen')}
          icon={RiDeviceComputerFill}
          isPrimary={isScreen()}
          onClick={() => switchControls('screen')}
        />
      </div>
      <div flex="~ 1" items="center" justify="end">
        <IconButton
          name={t('voice_hang_up')}
          icon={RiDeviceShutDownFill}
          onClick={() => handleHangUp()}
        />
      </div>
    </div>
  )
}
