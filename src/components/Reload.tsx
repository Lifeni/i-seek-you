import { useI18n } from '@solid-primitives/i18n'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import { Modal } from './base/Modal'

export const Reload = () => {
  const [t] = useI18n()
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
      name={t('reload_title')}
      size="xs"
      isOpen={needRefresh()}
      hasTitleBar
      hasActionBar
      actionText={[t('cancel'), t('reload')]}
      onConfirm={() => updateServiceWorker(true)}
      onCancel={() => setNeedRefresh(false)}
    >
      <div p="x-6 t-1 b-3" flex="~ col" items="center" justify="center">
        {t('reload_description')}
      </div>
    </Modal>
  )
}
