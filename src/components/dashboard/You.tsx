import { Link } from 'solid-app-router'
import { createSignal, For, useContext } from 'solid-js'
import { ConfigContext } from '../../context/Config'

export const You = () => {
  const [copied, setCopied] = createSignal(false)
  const [config] = useContext(ConfigContext)

  const id = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  const handleCopyID = () => {
    navigator.clipboard.writeText(`${location.href}#${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div flex="~ col" items="center" justify="center" p="b-3" gap="8">
      <div
        role="tooltip"
        aria-label="Your Emoji"
        data-position="top"
        pos="relative"
        w="16"
        h="16"
        flex="~"
        justify="center"
        items="center"
      >
        <Ripple />
        <Link
          href="/settings#emoji"
          z="1"
          transform="~ scale-400"
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
        {config.name} #{id}
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
          style={{ '--from': (item - 1) * 0.2, '--to': item * 0.2 }}
        />
      )}
    </For>
  </div>
)
