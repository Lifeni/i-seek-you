import { useLocation, useNavigate } from 'solid-app-router'
import { RiCommunicationChatNewFill } from 'solid-icons/ri'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Action } from './Figure'
import { Modal } from '../../base/Modal'

export const Join = () => {
  const [id, setId] = createSignal('')

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)

  let input: HTMLInputElement

  createEffect(() => {
    if (location.pathname === '/+') {
      setOpen(true)
      if (input) setTimeout(() => input.focus(), 100)
    } else setOpen(false)
  })

  const handleClose = () => navigate('/')
  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/channels/${id()}`)
      setId('')
    }
  }

  const handleInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value
    setId(value)
    if (value.length === 4) {
      navigate(`/channels/${id()}`)
      setId('')
    }
  }

  return (
    <>
      <Show when={open()}>
        <Title>Join - I Seek You</Title>
      </Show>

      <Action href="/+" name="Join" tooltip="Join a Channel">
        <RiCommunicationChatNewFill w="8" h="8" text="inherit" />
      </Action>

      <Modal size="sm" isOpen={open()} onClose={handleClose}>
        <input
          ref={el => (input = el)}
          class="px-4 py-2.5"
          aria-label="Enter a 4-digit ID to Connect"
          type="text"
          name="connect-id"
          id="connect-id"
          placeholder="Enter a 4-digit ID to Connect"
          pattern="[0-9]{4}"
          inputMode="numeric"
          maxLength="4"
          w="full"
          p="x-4 y-2.5"
          border="1 transparent hover:rose-500"
          bg="light-600 dark:dark-400"
          text="center gray-800 dark:gray-300"
          font="bold"
          ring="focus:4 rose-500"
          transition="border"
          outline="none"
          rounded="md"
          onInput={handleInput}
          onKeyDown={handleEnter}
        />
      </Modal>
    </>
  )
}
