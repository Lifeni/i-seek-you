import { useI18n } from '@solid-primitives/i18n'
import { useLocation, useNavigate } from 'solid-app-router'
import { RiSystemSettingsFill } from 'solid-icons/ri'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Modal } from '../base/Modal'
import { Tooltip } from '../base/Popover'
import { NavLink } from '../base/Text'
import { Password } from './settings/Password'
import { Profile } from './settings/Profile'

export const Settings = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/settings'))
  const handleClose = () => navigate('/')

  return (
    <>
      <Show when={open()}>
        <Title>{t('settings')} - I Seek You</Title>
      </Show>

      <Tooltip name={t('settings')} position="bottom-left">
        <NavLink
          id="nav-settings"
          href="/settings"
          icon={RiSystemSettingsFill}
        />
      </Tooltip>

      <Modal
        name={t('settings')}
        size="sm"
        hasTitleBar
        isOpen={open()}
        onCancel={handleClose}
      >
        <div flex="~ col" p="x-3 y-2" gap="3">
          <Profile />
          <Password />
        </div>
      </Modal>
    </>
  )
}
