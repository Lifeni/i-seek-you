import { RiCommunicationQuestionAnswerFill } from 'solid-icons/ri'
import { Input } from './message/Input'

export const Message = () => {
  return (
    <div w="full" min-h="50vh" flex="~ col" items="center" justify="center">
      <div flex="~ 1 col" items="center" justify="center">
        <RiCommunicationQuestionAnswerFill
          w="18"
          h="18"
          text="light-800 dark:dark-200"
        />
      </div>
      <div w="full" flex="~" items="end" gap="4">
        <Input />
      </div>
    </div>
  )
}
