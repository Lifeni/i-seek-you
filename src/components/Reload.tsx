import { useRegisterSW } from 'virtual:pwa-register/solid'
import { Modal } from './base/Modal'

export const Reload = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered() {
      console.debug('[service-worker]', 'registered')
    },
    onRegisterError(error) {
      console.debug('[service-worker]', 'registration error')
      console.error(error)
    },
  })

  return (
    <Modal
      name="Update App"
      size="xs"
      isOpen={needRefresh()}
      hasTitleBar
      hasActionBar
      actionText={['Cancel', 'Reload']}
      onConfirm={() => updateServiceWorker(true)}
      onCancel={() => setNeedRefresh(false)}
    >
      <div p="x-6 t-1 b-3" flex="~ col" items="center" justify="center">
        New content available, click on reload button to update.
      </div>
    </Modal>
  )
}
