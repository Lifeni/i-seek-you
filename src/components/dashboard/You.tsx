import { createSignal } from 'solid-js'

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
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div flex="center col" py="2" gap="16">
      <div class="tooltip tooltip-top" pt="8" data-label="Update Your Profile">
        <button
          class="ripple"
          w="2"
          h="2"
          rounded="full"
          flex="center"
          text="18 none"
          cursor="pointer"
        >
          {emoji}
        </button>
      </div>
      <button
        class="tooltip tooltip-top"
        data-label={copied() ? '✅ Copied' : 'Copy Your ID'}
        text="lg inherit"
        font="sans bold"
        border="none"
        bg="inherit"
        cursor="pointer"
        z="1"
        onClick={handleCopyID}
      >
        You #{id}
      </button>
    </div>
  )
}
