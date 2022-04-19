import { useNavigate } from 'solid-app-router'
import { RiOthersPlugFill } from 'solid-icons/ri'
import { useConnection } from '../../context/Connection'
import { useServer } from '../../context/Server'
import { Modal } from '../base/Modal'

export const Call = () => {
  const navigate = useNavigate()
  const [server] = useServer()
  const [connection, { setConfirm, setSignal, resetConnection }] =
    useConnection()

  const handleConfirm = () => {
    if (!connection.confirm || !connection.peer) return

    setConfirm(false)
    navigate(`/channels/${connection.peer?.id}`)
    setSignal('answer')
  }

  const handleCancel = () => {
    if (!connection.confirm || !connection.peer) return

    server.websocket?.send('error', {
      id: connection.peer?.id,
      message: 'Connection Refused',
    })
    setConfirm(false)
    resetConnection()
  }

  return (
    <Modal
      name="Request"
      size="xs"
      isOpen={connection.confirm}
      hasActionBar
      actionText={['Cancel', 'Connect']}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div p="6" flex="~ col" items="center" justify="center">
        <span pos="relative" m="t-6 b-8" z="1" text="4.5rem" select="none">
          {connection.peer?.emoji}
        </span>
        <span
          pos="relative"
          text="lg inherit center"
          font="bold"
          leading="none"
          select="none"
          z="1"
        >
          {connection.peer?.name} #{connection.peer?.id}
        </span>
        <div flex="~" items="center" justify="center" gap="2">
          <RiOthersPlugFill w="4.5" h="4.5" text="green-500 dark:green-400" />
          <span p="y-2" text="sm center" font="bold">
            Want To Connect
          </span>
        </div>
      </div>
    </Modal>
  )
}
