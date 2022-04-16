import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode'
import { useLocation, useNavigate } from 'solid-app-router'
import {
  RiDeviceQrCodeFill,
  RiDocumentFileCopy2Fill,
  RiSystemShareFill,
} from 'solid-icons/ri'
import { createEffect, createSignal, For, onMount, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { useSettings } from '../../../context/Settings'
import { useConnection } from '../../../context/Connection'
import Logo from '../../../assets/logo.svg'
import { Modal } from '../../base/Modal'
import { Action } from './Figure'

export const Share = () => {
  const [connection] = useConnection()
  const [settings] = useSettings()
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
    if ('share' in navigator) setShareable(true)
  })

  createEffect(() => {
    const url = `https://${window.location.host}/channels/${connection.id}`
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
      text: `Share from ${settings.name} #${connection.id}`,
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
        <Title>Share - I Seek You</Title>
      </Show>

      <Action name="Share" href="/share" tooltip="Share Your Link">
        <RiDeviceQrCodeFill w="7 sm:8" h="7 sm:8" text="inherit" />
      </Action>

      <Modal title="Share" size="xs" isOpen={open()} onClose={handleClose}>
        <div flex="~ col" gap="3" m="t-3">
          <div
            role="tooltip"
            aria-label={url()}
            data-position="top"
            pos="relative"
            m="x-3"
            grid="~ row"
            style={{
              'grid-template-columns': `repeat(${len()}, 1fr)`,
            }}
            rounded="sm"
            opacity={connection.id ? '100' : '0'}
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

          <section flex="~" p="x-2 b-2" gap="3">
            <button
              role="tooltip"
              aria-label={
                shareable() ? 'Share Your Link' : '🚫 Browser Not Support'
              }
              data-position="top"
              disabled={!shareable()}
              flex="~ 1"
              items="center"
              justify="center"
              gap="2"
              rounded="~"
              p="x-3 y-2"
              bg="light-600 dark:dark-400 active:(light-800 dark:dark-200)"
              cursor={shareable() ? 'pointer' : 'not-allowed'}
              onClick={handleShare}
            >
              <RiSystemShareFill
                w="4.5"
                h="4.5"
                text="gray-800 dark:gray-300"
              />
              <span text="sm" font="bold">
                Share
              </span>
            </button>
            <button
              role="tooltip"
              aria-label={copied() ? '✅ Copied' : `Copy Your Link`}
              data-position="top"
              flex="~ 1"
              items="center"
              justify="center"
              gap="2"
              rounded="~"
              p="x-3 y-2"
              bg="light-600 dark:dark-400 active:(light-800 dark:dark-200)"
              onClick={handleCopy}
            >
              <RiDocumentFileCopy2Fill
                w="4.5"
                h="4.5"
                text="gray-800 dark:gray-300"
              />
              <span text="sm" font="bold">
                Copy
              </span>
            </button>
          </section>
        </div>
      </Modal>
    </>
  )
}
