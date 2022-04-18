import { useLocation, useNavigate } from 'solid-app-router'
import { RiCommunicationChatNewFill } from 'solid-icons/ri'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Input } from '../../base/Form'
import { Modal } from '../../base/Modal'
import { ActionLink } from './Figure'

export const Join = () => {
  const [id, setId] = createSignal('')

  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setOpen] = createSignal(false)

  createEffect(() => setOpen(location.pathname === '/+'))

  const handleClose = () => navigate('/')
  const handleEnter = () => {
    navigate(`/channels/${id()}`)
    setId('')
  }

  const handleInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value
    setId(value)
    if (value.length !== 4) return
    handleEnter()
  }

  return (
    <>
      <Show when={isOpen()}>
        <Title>Join - I Seek You</Title>
      </Show>

      <ActionLink
        href="/+"
        icon={RiCommunicationChatNewFill}
        name="Join a Channel"
      >
        Join
      </ActionLink>

      <Modal
        name="Join"
        size="sm"
        isOpen={isOpen()}
        isBlur
        onCancel={handleClose}
      >
        <Input
          type="text"
          name="connect-id"
          placeholder="Enter a 4-digit ID to Connect"
          pattern="[0-9]{4}"
          inputMode="numeric"
          maxLength="4"
          p="x-4 y-2.5"
          font="bold"
          rounded="md"
          text="center"
          isFocus={isOpen()}
          value={id()}
          onInput={handleInput}
          onEnter={handleEnter}
        />
      </Modal>
    </>
  )
}
