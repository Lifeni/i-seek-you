import { useLocation, useNavigate } from 'solid-app-router'
import { RiSystemSettingsFill } from 'solid-icons/ri'
import { createSignal, onMount } from 'solid-js'
import { Modal } from '../Modal'
import { Password } from './settings/Password'
import { Profile } from './settings/Profile'

export const Settings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    if (location.pathname === '/settings') handleOpen()
  })

  const handleOpen = () => {
    setOpen(true)
    navigate('/settings')
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <sl-tooltip content="Settings" placement="bottom-end">
        <button
          aria-label="Settings"
          flex="~"
          rounded="full"
          p="3"
          border="none"
          bg="transparent hover:light-600 dark:hover:dark-400"
          onClick={handleOpen}
        >
          <RiSystemSettingsFill class="w-6 h-6" text="gray-800 dark:gray-300" />
        </button>
      </sl-tooltip>

      <Modal title="Settings" width="84" open={open()} onClose={handleClose}>
        <Profile />
        <Password />
      </Modal>
    </>
  )
}
