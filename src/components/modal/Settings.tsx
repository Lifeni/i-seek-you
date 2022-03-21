import { type JSX } from 'solid-js'
import { Modal } from '../Modal'
import { Password } from './settings/Password'
import { Profile } from './settings/Profile'
import { Theme } from './settings/Theme'

interface SettingsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  close: () => void
}

export const Settings = (props: SettingsProps) => {
  return (
    <Modal title="Settings" close={props.close}>
      <Profile />
      <Password />
      <Theme />
      <p
        flex="~"
        items="center"
        p="x-3 b-2"
        text="sm gray-500 dark:gray-400"
        font="bold"
      >
        <span flex="1" select="none">
          I Seek You © MIT License
        </span>
        <a
          href="https://github.com/Lifeni/i-seek-you"
          target="_blank"
          rel="noopener noreferrer"
          text="rose-500 hover:underline"
          font="bold"
        >
          GitHub
        </a>
      </p>
    </Modal>
  )
}

const EmojiPanel = () => <div></div>
