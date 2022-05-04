import { TextMessage } from '../../../../index.d'

interface TextProps {
  message: TextMessage
  isAuthor?: boolean
}

export const Text = (props: TextProps) => {
  return (
    <pre
      w="fit"
      p="x-3 y-2"
      max-w="full"
      rounded="~"
      text={
        props.isAuthor
          ? 'sm light-100 dark:light-600 break-all'
          : 'sm gray-800 dark:gray-300 break-all'
      }
      bg={props.isAuthor ? 'rose-500' : 'light-600 dark:dark-400'}
      font="sans"
      whitespace="pre-wrap"
    >
      {props.message.content}
    </pre>
  )
}
