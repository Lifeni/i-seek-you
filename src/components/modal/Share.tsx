import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode'
import { useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceQrCodeFill,
  RiDocumentFileCopy2Fill,
  RiSystemShareFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, For, onMount } from 'solid-js'
import { Title } from 'solid-meta'
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
    qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.M)
    qrcode.write(url)
    qrcode.make()
    setMatrix(qrcode.getMatrix())

    if (typeof navigator.share === 'function') setShareable(true)
  })

  const handleShare = () =>
    navigator.share({
      title: 'I Seek You',
      text: `Share from ${config.name} ${session.id}`,
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
      <Title>Share - I Seek You</Title>

      <Avatar name="Share" href="/share" tooltip="Share Your Link">
        <RiDeviceQrCodeFill class="w-8 h-8" text="inherit" />
      </Avatar>

      <Modal title="Share" size="sm" isOpen={open()} onClose={handleClose}>
        <div flex="~ col" gap="3">
          <div
            role="figure"
            aria-label="QR Code"
            m="x-3"
            flex="~ col"
            rounded="sm"
          >
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

          <input
            aria-label="Your Link"
            type="text"
            value={url()}
            placeholder="Your Link"
            m="x-3"
            p="x-4 y-2"
            border="1 transparent hover:rose-500"
            bg="light-600 dark:dark-400"
            text="center gray-800 dark:gray-300"
            outline="none"
            ring="focus:4 rose-500"
            transition="border"
            rounded="sm"
          />

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
