import { type IconTypes } from 'solid-icons'
import {
  RiBusinessSendPlaneFill,
  RiMediaImage2Fill,
  RiMediaVidiconFill,
} from 'solid-icons/ri'
import { createSignal } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useChannel } from '../../../context/Channel'

export const Input = () => {
  const [channel, { setMode }] = useChannel()
  const [text, setText] = createSignal('')

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    setText(target.value)
    target.style.height = `44px`
    target.style.height = `${target.scrollHeight}px`
  }

  return (
    <div w="full" flex="~" items="end" gap="3">
      <div flex="~" items="center">
        <Action
          title="Voice"
          icon={RiMediaVidiconFill}
          onClick={() => setMode('voice')}
        />
        <Action title="File" icon={RiMediaImage2Fill} onClick={() => {}} />
      </div>
      <textarea
        placeholder="Type Here..."
        w="full"
        h="11"
        flex="~ 1"
        p="x-4 y-2.25"
        text="inherit"
        border="none"
        bg="light-600 dark:dark-400"
        rounded="md"
        outline="none"
        overflow="hidden"
        resize="none"
        onInput={handleInput}
      />
      <div flex="~" items="center">
        <Action
          title="Send"
          icon={RiBusinessSendPlaneFill}
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

interface ActionProps {
  title: string
  icon: IconTypes
  onClick: () => void
}

const Action = (props: ActionProps) => (
  <button
    role="tooltip"
    aria-label={props.title}
    data-position="top"
    w="11"
    h="11"
    flex="~"
    justify="center"
    items="center"
    rounded="full"
    text="inherit"
    bg="hover:(light-600 dark:dark-400)"
    onClick={props.onClick}
  >
    <Dynamic component={props.icon} w="5" h="5" />
  </button>
)
