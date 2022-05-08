import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode'
import { useI18n } from '@solid-primitives/i18n'
import { useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceQrCodeFill,
  RiDocumentFileCopy2Fill,
  RiSystemShareFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, For, onMount, Show } from 'solid-js'
import { Title } from 'solid-meta'
import Logo from '../../../assets/logo.svg'
import { useServer } from '../../../context/Server'
import { useSettings } from '../../../context/Settings'
import { Button } from '../../base/Button'
import { Modal } from '../../base/Modal'
import { Link } from '../../base/Text'
import { ActionLink } from './Figure'

export const Share = () => {
  const [settings] = useSettings()
  const [server] = useServer()

  const [copied, setCopied] = createSignal(false)
  const [shareable, setShareable] = createSignal(false)
  const [matrix, setMatrix] = createSignal<boolean[][]>([])

  const len = () => matrix().length
  const [t] = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)
  const [url, setUrl] = createSignal('')

  onMount(() => setShareable('share' in navigator))
  createEffect(() => setOpen(location.pathname === '/share'))
  const handleClose = () => navigate('/')

  createEffect(() => {
    const protocol = window.location.protocol
    const url = `${protocol}//${window.location.host}/channels/${server.id}`
    setUrl(url)
    const qrcode = new Encoder()
    qrcode.setEncodingHint(true)
    qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.Q)
    qrcode.write(url)
    qrcode.make()
    setMatrix(qrcode.getMatrix())
  })

  const handleShare = () =>
    navigator.share({
      title: 'I Seek You',
      text: t('share_description', { name: `${settings.name} #${server.id}` }),
      url: url(),
    })

  const handleCopy = () => {
    navigator.clipboard.writeText(url())
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <>
      <Show when={open()}>
        <Title>{t('share')} - I Seek You</Title>
      </Show>

      <ActionLink
        id="nav-share"
        href="/share"
        icon={RiDeviceQrCodeFill}
        name={t('share_tooltip')}
      >
        {t('share')}
      </ActionLink>

      <Modal
        name={t('share')}
        size="sm"
        hasTitleBar
        isOpen={open()}
        onCancel={handleClose}
      >
        <div flex="~ col" gap="3" p="x-3 y-2">
          <div
            pos="relative"
            m="x-3"
            grid="~ row"
            style={{
              'grid-template-columns': `repeat(${len()}, 1fr)`,
            }}
            rounded="sm"
            opacity={server.id ? '100' : '0'}
            transition="opacity"
          >
            <div
              pos="absolute"
              top="0"
              left="0"
              z="1"
              w="full"
              h="full"
              flex="~"
              items="center"
              justify="center"
              pointer="none"
            >
              <img
                src={Logo}
                alt="I Seek You Logo"
                w="16"
                h="16"
                shadow="xl"
                rounded="full"
              />
            </div>
            <For each={matrix()}>
              {row => (
                <For each={row}>
                  {cube => (
                    <div
                      aspect="square"
                      bg={
                        cube
                          ? 'gray-800 dark:gray-300'
                          : 'light-100 dark:dark-800'
                      }
                    />
                  )}
                </For>
              )}
            </For>
          </div>

          <Link
            href={url()}
            isExternal
            w="full"
            m="0"
            p="x-1"
            text="center break-words inherit no-underline hover:underline"
          >
            {settings.name} #{server.id}
          </Link>

          <section flex="~" p="x-1 b-2" gap="3">
            <Show when={shareable()}>
              <Button icon={RiSystemShareFill} onClick={handleShare}>
                {t('share')}
              </Button>
            </Show>

            <Button icon={RiDocumentFileCopy2Fill} onClick={handleCopy}>
              {copied() ? t('copied') : t('copy')}
            </Button>
          </section>
        </div>
      </Modal>
    </>
  )
}
