import { RiBusinessSendPlaneFill } from 'solid-icons/ri'
import { createSignal } from 'solid-js'

export const Input = () => {
  const [text, setText] = createSignal('')

  return (
    <div w="full" flex="~" gap="4" items="end">
      <textarea
        placeholder="Type Here..."
        w="full"
        h="12"
        min-h="12"
        flex="~ 1"
        p="x-4 y-3"
        border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
        text="inherit"
        bg="light-600 dark:dark-400"
        ring="focus:4 rose-500"
        transition="border"
        outline="none"
        onInput={e => setText((e.target as HTMLInputElement).value)}
      />
      <button
        role="tooltip"
        aria-label="Send"
        data-position="top"
        flex="~"
        rounded="full"
        p="3"
        bg="rose-500"
        shadow="lg"
      >
        <RiBusinessSendPlaneFill
          class="w-6 h-6"
          text="light-100 dark:light-600"
        />
      </button>
    </div>
  )
}
