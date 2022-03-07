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

  const copy = () => (copied() ? '✅ Copied' : 'Copy Your ID')
  const emoji = EmojiList[Math.floor(Math.random() * EmojiList.length)]
  const id = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  const handleCopyID = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div flex="center col" py="2" gap="16">
      <div class="tooltip tooltip-top" pt="8" data-label="Update Your Profile">
        <button
          pos="relative"
          w="0"
          h="0"
          rounded="full"
          flex="center"
          text="18 none"
          cursor="pointer"
        >
          <div class="ripple" aria-label="hidden">
            <span data-ring="1"></span>
            <span data-ring="2"></span>
            <span data-ring="3"></span>
            <span data-ring="4"></span>
            <span data-ring="5"></span>
          </div>
          <span z="1">{emoji}</span>
        </button>
      </div>
      <button
        class="tooltip tooltip-top"
        text="lg inherit"
        font="sans bold"
        border="none"
        bg="inherit"
        cursor="pointer"
        z="1"
        data-label={copy()}
        onClick={handleCopyID}
      >
        You #{id}
      </button>
    </div>
  )
}
