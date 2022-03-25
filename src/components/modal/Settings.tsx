import { Link, useLocation, useNavigate } from 'solid-app-router'
import { RiSystemSettingsFill } from 'solid-icons/ri'
import { createEffect, createSignal } from 'solid-js'
import { Title } from 'solid-meta'
import { Modal } from '../Modal'
import { Password } from './settings/Password'
import { Profile } from './settings/Profile'

export const Settings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/settings'))

  const handleClose = () => navigate('/')

  return (
    <>
      <Title>Settings - I Seek You</Title>

      <Link
        role="tooltip"
        aria-label="Settings"
        data-position="bottom-left"
        href="/settings"
        flex="~"
        rounded="full"
        p="3"
        border="none"
        bg="transparent hover:light-600 dark:hover:dark-400"
      >
        <RiSystemSettingsFill class="w-6 h-6" text="gray-800 dark:gray-300" />
      </Link>

      <Modal title="Settings" size="sm" isOpen={open()} onClose={handleClose}>
        <Profile />
        <Password />
      </Modal>
    </>
  )
}
