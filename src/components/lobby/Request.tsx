import { useNavigate } from 'solid-app-router'
import { useChannel } from '../../context/Channel'
import { useConnection } from '../../context/Connection'
import { Dialog } from '../base/Dialog'

export const Request = () => {
  const navigate = useNavigate()
  const [channel, { setConfirm, setSignal, resetChannel }] = useChannel()
  const [, { sendWebSocket }] = useConnection()

  const handleConfirm = () => {
    if (channel.confirm && channel.peer) {
      setConfirm(false)
      navigate(`/channels/${channel.peer?.id}`)
      setSignal('answer')
    }
  }

  const handleCancel = () => {
    if (channel.confirm && channel.peer) {
      sendWebSocket('error', {
        id: channel.peer?.id,
        message: 'Connection Refused',
      })
      setConfirm(false)
      resetChannel()
    }
  }

  return (
    <Dialog
      confirmText="Connect"
      isOpen={channel.confirm}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div p="x-3 y-6" flex="~ col" items="center" justify="center">
        <span pos="relative" m="y-8" z="1" text="4.5rem" select="none">
          {channel.peer?.emoji}
        </span>
        <span
          pos="relative"
          text="lg inherit center"
          font="bold"
          leading="none"
          select="none"
          z="1"
        >
          {channel.peer?.name} #{channel.peer?.id}
        </span>
        <span p="y-2" text="sm center">
          Want to Connect
        </span>
      </div>
    </Dialog>
  )
}
