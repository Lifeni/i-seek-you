import { createSignal } from 'solid-js'
import { Tooltip } from '../base/Tooltip'
import { Background } from './Background'

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
    <div flex="center col" p="b-3" gap="12">
      <Tooltip label="Update Your Profile">
        <button
          class="button"
          pos="relative"
          w="16"
          h="16"
          bg="transparent"
          flex="center"
          rounded="full"
          text="18"
        >
          <Background />
          <span z="1">{emoji}</span>
        </button>
      </Tooltip>

      <Tooltip label={copy()}>
        <button
          class="button"
          text="lg inherit"
          bg="inherit"
          font="sans bold"
          leading="none"
          onClick={handleCopyID}
        >
          You #{id}
        </button>
      </Tooltip>
    </div>
  )
}
