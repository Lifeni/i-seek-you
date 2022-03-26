import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode'
import { useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceQrCodeFill,
  RiDocumentFileCopy2Fill,
  RiSystemShareFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, For, onMount, Show } from 'solid-js'
import { Title } from 'solid-meta'
import Logo from '../../assets/logo.svg'
import { useConfig } from '../../context/Config'
import { useSession } from '../../context/Session'
import { Avatar } from '../dashboard/Avatar'
import { Modal } from '../Modal'

export const Share = () => {
  const [session] = useSession()
  const [config] = useConfig()
  const [copied, setCopied] = createSignal(false)
  const [shareable, setShareable] = createSignal(false)
  const [matrix, setMatrix] = createSignal<boolean[][]>([])
  const len = () => matrix().length

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)
  const [url, setUrl] = createSignal('')

  createEffect(() => setOpen(location.pathname === '/share'))
  const handleClose = () => navigate('/')

  onMount(() => {
    const url = `https://${window.location.host}/channels/${session.id}`
    setUrl(url)

    const qrcode = new Encoder()
    qrcode.setEncodingHint(true)
    qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.Q)
    qrcode.write(url)
    qrcode.make()
    setMatrix(qrcode.getMatrix())

    if (typeof navigator.share === 'function') setShareable(true)
  })

  const handleShare = () =>
    navigator.share({
      title: 'I Seek You',
      text: `Share from ${config.name} #${session.id}`,
      url: url(),
    })

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/channels/${session.id}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <>
      <Show when={open()}>
        <Title>Share - I Seek You</Title>
      </Show>

      <Avatar name="Share" href="/share" tooltip="Share Your Link">
        <RiDeviceQrCodeFill class="w-8 h-8" text="inherit" />
      </Avatar>

      <Modal title="Share" size="xs" isOpen={open()} onClose={handleClose}>
        <div flex="~ col" gap="3">
          <div
            role="tooltip"
            aria-label={url()}
            data-position="top"
            pos="relative"
            m="x-3"
            flex="~ col"
            rounded="sm"
          >
            <img
              src={Logo}
              alt="I Seek You Logo"
              pos="absolute"
              top="1/2"
              left="1/2"
              z="1"
              w="16"
              h="16"
              transform="~ -translate-x-1/2 -translate-y-1/2"
              shadow="xl"
              rounded="full"
            />
            <For each={matrix()}>
              {row => (
                <div
                  w="full"
                  grid="~ row"
                  style={{
                    'grid-template-columns': `repeat(${len()}, 1fr)`,
                  }}
                >
                  <For each={row}>
                    {cube => (
                      <div
                        aspect="square"
                        bg={
                          cube
                            ? 'gray-800 dark:gray-300'
                            : 'light-100 dark:dark-800'
                        }
                      ></div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>

          <section flex="~" justify="end" gap="3">
            <button
              role="tooltip"
              aria-label={shareable() ? 'Share' : '🚫 Browser Not Support'}
              data-position="top"
              disabled={!shareable()}
              flex="~"
              rounded="full"
              p="3"
              bg="transparent hover:light-600 dark:hover:dark-400"
              cursor={shareable() ? 'pointer' : 'not-allowed'}
              onClick={handleShare}
            >
              <RiSystemShareFill
                class="w-6 h-6"
                text="gray-800 dark:gray-300"
              />
            </button>
            <button
              role="tooltip"
              aria-label={copied() ? '✅ Copied' : `Copy Your Link`}
              data-position="top"
              flex="~"
              rounded="full"
              p="3"
              bg="transparent hover:light-600 dark:hover:dark-400"
              onClick={handleCopy}
            >
              <RiDocumentFileCopy2Fill
                class="w-6 h-6"
                text="gray-800 dark:gray-300"
              />
            </button>
          </section>
        </div>
      </Modal>
    </>
  )
}
