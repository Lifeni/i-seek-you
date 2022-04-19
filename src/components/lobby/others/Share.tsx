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
import { useServer } from '../../../context/Server'
import Logo from '../../../assets/logo.svg'
import { Modal } from '../../base/Modal'
import { ActionLink } from './Figure'
import { Button } from '../../base/Button'
import { Tooltip } from '../../base/Popover'

export const Share = () => {
  const [settings] = useSettings()
  const [server] = useServer()

  const [copied, setCopied] = createSignal(false)
  const [shareable, setShareable] = createSignal(false)
  const [matrix, setMatrix] = createSignal<boolean[][]>([])

  const len = () => matrix().length

  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = createSignal(false)
  const [url, setUrl] = createSignal('')

  onMount(() => setShareable('share' in navigator))
  createEffect(() => setOpen(location.pathname === '/share'))
  const handleClose = () => navigate('/')

  createEffect(() => {
    const url = `https://${window.location.host}/channels/${server.id}`
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
      text: `Share from ${settings.name} #${server.id}`,
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

      <ActionLink
        href="/share"
        icon={RiDeviceQrCodeFill}
        name="Share Your Link"
      >
        Share
      </ActionLink>

      <Modal
        name="Share"
        size="sm"
        hasTitleBar
        isOpen={open()}
        onCancel={handleClose}
      >
        <div flex="~ col" gap="3" p="x-3 y-2">
          <Tooltip name={url()}>
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
          </Tooltip>

          <section flex="~" p="x-1 t-1 b-2" gap="3">
            <Show when={shareable()}>
              <Button icon={RiSystemShareFill} onClick={handleShare}>
                Share
              </Button>
            </Show>

            <Button icon={RiDocumentFileCopy2Fill} onClick={handleCopy}>
              {copied() ? 'Copied' : `Copy`}
            </Button>
          </section>
        </div>
      </Modal>
    </>
  )
}
