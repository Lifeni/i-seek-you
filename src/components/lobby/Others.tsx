import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, For, onMount } from 'solid-js'
import { ChannelProvider } from '../../context/Channel'
import { Channels } from '../Channels'
import { Join } from '../Join'
import { Share } from '../Share'
import { Action, Peer } from './Figure'

type OthersInfo = {
  name: string
  id: string
  password: boolean
  emoji: string
}

const examples = [
  {
    name: 'Example 1',
    id: '0000',
    emoji: '🤖',
    password: false,
  },
  {
    name: 'Example 2',
    id: '1111',
    emoji: '💀',
    password: true,
  },
  {
    name: '',
    id: '2222',
    emoji: '😶',
    password: false,
  },
]

// const examples: OthersInfo[] = []

export const Others = () => (
  <div flex="~  1" items="center" justify="center" z="10" gap="6 sm:8">
    <Share />
    <For each={examples} fallback={<Seeking />}>
      {item => <Peer {...item} />}
    </For>
    <ChannelProvider>
      <Channels />
    </ChannelProvider>
    <Join />
  </div>
)

const Seeking = () => {
  const [suffix, setSuffix] = createSignal('')

  onMount(() => {
    setInterval(() => {
      suffix().length === 3 ? setSuffix('') : setSuffix(s => (s += '.'))
    }, 600)
  })

  return (
    <Action
      name={
        <span pos="relative" font="bold" select="none">
          Seeking
          <span pos="absolute" left="full">
            {suffix()}
          </span>
        </span>
      }
      tooltip="Seeking Local Devices"
      href="/"
      text="light-100 dark:light-600"
      bg="rose-500"
    >
      <RiDevicePhoneFindFill class="w-8 h-8" text="inherit" />
    </Action>
  )
}
