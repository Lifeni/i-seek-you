import { Link } from 'solid-app-router'
import { createSignal, For } from 'solid-js'
import { useConfig } from '../../context/Config'
import { useSession } from '../../context/Session'

export const You = () => {
  const [copied, setCopied] = createSignal(false)
  const [config] = useConfig()
  const [session] = useSession()

  const handleCopyID = () => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/channels/${session.id}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div flex="~ col" items="center" justify="center" p="b-3" gap="8">
      <div
        pos="relative"
        w="16"
        h="16"
        flex="~"
        justify="center"
        items="center"
      >
        <Ripple />
        <Link
          role="tooltip"
          aria-label="Change Your Emoji"
          data-position="top"
          href="/settings#emoji"
          z="1"
          text="4.5rem"
          select="none"
        >
          {config.emoji}
        </Link>
      </div>

      <button
        role="tooltip"
        aria-label={copied() ? '✅ Copied' : `Copy Your Link`}
        data-position="top"
        text="lg inherit"
        bg="inherit"
        font="sans bold"
        leading="none"
        select="none"
        z="1"
        onClick={handleCopyID}
      >
        {config.name} #{session.id}
      </button>
    </div>
  )
}

const Ripple = () => (
  <div
    aria-label="hidden"
    pos="absolute"
    left="50%"
    top="50%"
    pointer="none"
    z="0"
  >
    <For each={[1, 2, 3, 4, 5]}>
      {item => (
        <span
          pos="absolute"
          left="50%"
          top="50%"
          transform="~ -translate-x-1/2 -translate-y-1/2"
          flex="~"
          border="light-600 dark:dark-400 6"
          rounded="full"
          animate="ripple motion-reduce:none"
          style={{
            '--from': (item - 1) * 0.2,
            '--to': item * 0.2,
            '--size-from': 'calc(var(--from) * max(100vh, 100vw))',
            '--size-to': 'calc(var(--to) * max(100vh, 100vw))',
            'will-change': 'opacity',
          }}
        />
      )}
    </For>
  </div>
)
