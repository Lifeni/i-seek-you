import { useI18n } from '@solid-primitives/i18n'
import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, For, onMount } from 'solid-js'
import { useServer } from '../../context/Server'
import { Channels } from '../Channels'
import { ActionLink, PeerLink } from './others/Figure'
import { Join } from './others/Join'
import { Share } from './others/Share'

export const Others = () => {
  const [server] = useServer()

  return (
    <div pos="relative" flex="~ 1 col" items="center" justify="center" z="10">
      <div flex="~ wrap" items="center" justify="center" gap="4 sm:8">
        <Share />
        <For each={server.peers} fallback={<Seeking />}>
          {item => <PeerLink {...item} />}
        </For>
        <Channels />
        <Join />
      </div>
    </div>
  )
}

const Seeking = () => {
  const [t] = useI18n()
  const [suffix, setSuffix] = createSignal('')

  onMount(() => {
    setInterval(() => {
      suffix().length === 3 ? setSuffix('') : setSuffix(s => (s += '.'))
    }, 600)
  })

  return (
    <ActionLink
      name={t('seeking_tooltip')}
      href="/"
      icon={RiDevicePhoneFindFill}
      isPrimary
    >
      <span pos="relative" font="bold" select="none">
        {t('seeking')}
        <span pos="absolute" left="full">
          {suffix()}
        </span>
      </span>
    </ActionLink>
  )
}
