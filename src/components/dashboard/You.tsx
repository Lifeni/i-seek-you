import { createSignal, For } from 'solid-js'

// prettier-ignore
const EmojiList = [
  '😏', '😅', '😎', '🤡', '👽',
  '👾', '🤖', '💩', '💀', '🐵',
  '🐶', '🐺', '🐱', '🦁', '🐯',
  '🦊', '🦝', '🐮', '🐷', '🐭',
  '🐹', '🐰', '🐻', '🐻‍❄️', '🐨',
  '🐼', '🐸', '🐔', '🦀', '🐳',
  '🦐', '🐤', '🦉', '🦚', '🕊️',
  '🐲', '🦄', '🦕', '🐇', '🐙',
  '😂', '😚', '🙃', '🥳', '🧐'
]

export const You = () => {
  const [copied, setCopied] = createSignal(false)

  const emoji = EmojiList[Math.floor(Math.random() * EmojiList.length)]
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
        pos="relative"
        w="16"
        h="16"
        flex="~"
        justify="center"
        items="center"
      >
        <Ripple />
        <span z="1" transform="~ scale-400" select="none">
          {emoji}
        </span>
      </div>

      <button
        role="tooltip"
        aria-label={copied() ? '✅ Copied' : `🔗 Copy Your Link`}
        data-position="top"
        text="lg inherit"
        bg="inherit"
        font="sans bold"
        leading="none"
        select="none"
        z="1"
        onClick={handleCopyID}
      >
        You #{id}
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
            'will-change': 'width, height, opacity',
          }}
        />
      )}
    </For>
  </div>
)
