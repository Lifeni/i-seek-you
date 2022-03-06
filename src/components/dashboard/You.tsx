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

const You = () => {
  const emoji = EmojiList[Math.floor(Math.random() * EmojiList.length)]
  const id = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return (
    <div display="flex" flex="col" items="center" py="4" gap="6">
      <div
        rounded="full"
        display="center"
        text="18"
        leading="none"
        select="none"
        filter="drop-shadow-2xl"
      >
        {emoji}
      </div>
      <span text="lg" font="bold">
        You #{id}
      </span>
    </div>
  )
}

export { You }
