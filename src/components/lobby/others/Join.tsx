import { useI18n } from '@solid-primitives/i18n'
import { useLocation, useNavigate } from 'solid-app-router'
import { RiCommunicationChatNewFill } from 'solid-icons/ri'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Input } from '../../base/Form'
import { Modal } from '../../base/Modal'
import { ActionLink } from './Figure'

export const Join = () => {
  const [id, setId] = createSignal('')
  const [t] = useI18n()
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
  }

  return (
    <>
      <Show when={isOpen()}>
        <Title>{t('join')} - I Seek You</Title>
      </Show>

      <ActionLink
        id="nav-join"
        href="/+"
        icon={RiCommunicationChatNewFill}
        name={t('join_tooltip')}
      >
        {t('join')}
      </ActionLink>

      <Modal
        name={t('join')}
        size="sm"
        isOpen={isOpen()}
        isBlur
        onCancel={handleClose}
      >
        <Input
          id="join-input"
          type="text"
          name="connect-id"
          placeholder={t('join_placeholder')}
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
