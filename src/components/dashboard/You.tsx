// prettier-ignore
const EmojiList = [
  '😏', '😅', '😎', '🤡', '👽',
  '👾', '🤖', '💩', '👻', '🐵',
  '🐶', '🐺', '🐱', '🦁', '🐯',
  '🦊', '🦝', '🐮', '🐷', '🐭',
  '🐹', '🐰', '🐻', '🐻‍❄️', '🐨',
  '🐼', '🐸', '🐧', '🦀', '🐳',
  '🦐', '🐤', '🦉', '🦚', '🦩',
  '🐔', '🐲', '🦄', '🐢', '🐍',
  '🦕', '🦈', '🐙', '🦋', '🐞',
]

export const You = () => {
  const emoji = EmojiList[Math.floor(Math.random() * EmojiList.length)]
  const id = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return (
    <div flex="center col" py="4" gap="6">
      <div rounded="full" flex="center" text="18 none" filter="drop-shadow-2xl">
        {emoji}
      </div>
      <span text="lg" font="bold">
        You #{id}
      </span>
    </div>
  )
}
